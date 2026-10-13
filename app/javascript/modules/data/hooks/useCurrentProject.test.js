import { act, renderHook } from '@testing-library/react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import request from 'superagent';

import { dataReducer } from '../redux/reducer';
import { useCurrentProject } from './useCurrentProject';

jest.mock('modules/api', () => ({
    Loader: jest.requireActual('modules/api/Loader').default,
}));
jest.mock('modules/routes', () => ({
    pathBase: jest.requireActual('modules/routes/pathBase').default,
}));
jest.mock('superagent', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

const base = {
    id: 7,
    shortname: 'pilot',
    name: { de: 'Pilot' },
    available_locales: ['de', 'en'],
    default_locale: 'de',
    archive_domain: null,
};
const umbrella = {
    id: 1,
    shortname: 'ohd',
    is_umbrella: true,
    archive_domain: 'https://portal.example',
};

function makeStore(projects = { 7: base, 1: umbrella }) {
    const data = dataReducer(undefined, {});
    return createStore(
        combineReducers({ data: dataReducer }),
        {
            data: {
                ...data,
                projects,
                projectRepresentations: Object.fromEntries(
                    Object.keys(projects).map((id) => [id, 'base'])
                ),
            },
        },
        applyMiddleware(thunk)
    );
}

function mount(store, hook, path = '/pilot/de/search') {
    let navigate;
    function Navigation() {
        navigate = useNavigate();
        return null;
    }
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={[path]}>
                    <Navigation />
                    {children}
                </MemoryRouter>
            </Provider>
        );
    }
    Wrapper.propTypes = { children: PropTypes.node };
    const rendered = renderHook(hook, { wrapper: Wrapper });
    return { ...rendered, navigate: (path) => act(() => navigate(path)) };
}

describe('current project loading through Redux', () => {
    let pending;

    beforeEach(() => {
        pending = [];
        request.get.mockReset();
        request.get.mockImplementation(() => {
            const handle = {
                use: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                query: jest.fn().mockReturnThis(),
                end: jest.fn((callback) => {
                    pending.push(callback);
                    return handle;
                }),
            };
            return handle;
        });
    });

    async function succeed(index = 0, project = base) {
        await act(async () => {
            pending[index](null, {
                status: 200,
                text: JSON.stringify({
                    id: project.id,
                    data_type: 'projects',
                    data: {
                        ...project,
                        translations_attributes: [
                            { id: 20, locale: 'de', name: 'Pilot' },
                        ],
                    },
                }),
            });
        });
    }

    test('uses base bootstrap without a request until details are needed', async () => {
        const store = makeStore();
        let lite = true;
        const view = mount(store, () => useCurrentProject({ lite }));
        expect(view.result.current.project).toEqual(base);
        expect(request.get).not.toHaveBeenCalled();
        lite = false;
        view.rerender();
        expect(view.result.current.isLoading).toBe(true);
        expect(view.result.current.project).toBeNull();
        expect(request.get).toHaveBeenCalledTimes(1);
        await succeed();
        expect(
            view.result.current.project.translations_attributes
        ).toHaveLength(1);
        expect(view.result.current.isLoading).toBe(false);
        expect(store.getState().data.projectRepresentations[7]).toBe('detail');
        expect(store.getState().data.projectRepresentations[1]).toBe('base');
    });

    test('concurrent detail consumers share one request and reuse loaded details', async () => {
        const store = makeStore();
        const view = mount(store, () => [
            useCurrentProject({ lite: false }),
            useCurrentProject({ lite: false }),
        ]);
        expect(request.get).toHaveBeenCalledTimes(1);
        await succeed();
        expect(view.result.current[0].project).toBe(
            view.result.current[1].project
        );
        view.unmount();
        mount(store, () => useCurrentProject({ lite: false }));
        expect(request.get).toHaveBeenCalledTimes(1);
    });

    test('loads a missing route project directly into Redux without a second request', async () => {
        const store = makeStore();
        const view = mount(
            store,
            () => [useCurrentProject(), useCurrentProject({ lite: false })],
            '/other/de/search'
        );
        expect(request.get).toHaveBeenCalledWith(
            '/other/de/projects/other.json'
        );
        expect(request.get).toHaveBeenCalledTimes(1);
        await succeed(0, { ...base, id: 8, shortname: 'other' });
        expect(view.result.current[0].project.id).toBe(8);
        expect(view.result.current[1].project.id).toBe(8);
        expect(request.get).toHaveBeenCalledTimes(1);
        expect(store.getState().data.projects[7]).toBe(base);
    });

    test('loads the right project and locale during shared-domain navigation', async () => {
        const store = makeStore({
            7: base,
            8: { ...base, id: 8, shortname: 'other' },
            1: umbrella,
        });
        const view = mount(store, () => useCurrentProject({ lite: false }));
        await succeed();
        view.navigate('/other/en/search');
        expect(request.get).toHaveBeenLastCalledWith(
            '/other/en/projects/other.json'
        );
        expect(view.result.current.project).toBeNull();
        await succeed(1, { ...base, id: 8, shortname: 'other' });
        expect(view.result.current.project.shortname).toBe('other');
        view.navigate('/pilot/de/search');
        expect(view.result.current.project.id).toBe(7);
        expect(request.get).toHaveBeenCalledTimes(2);
    });

    test('uses the locale-only path on a dedicated domain and normalizes its slash', async () => {
        const project = {
            ...base,
            archive_domain: `${window.location.origin}/`,
        };
        const store = makeStore({ 7: project, 1: umbrella });
        const view = mount(
            store,
            () => useCurrentProject({ lite: false }),
            '/en/search'
        );
        expect(request.get).toHaveBeenCalledWith('/en/projects/7.json');
        await succeed(0, project);
        expect(view.result.current.projectDbId).toBe(7);
    });

    test('does not replace an unknown route project with the umbrella project', async () => {
        const store = makeStore();
        const view = mount(
            store,
            () => useCurrentProject(),
            '/unknown/de/search'
        );
        await succeed(0, base);
        expect(view.result.current.project).toBeNull();
        expect(view.result.current.error.message).toContain('did not match');
        expect(view.result.current.isLoading).toBe(false);
        expect(store.getState().data.projects[7]).toBe(base);
    });

    test('reports denied access without treating base data as detail or retrying forever', async () => {
        const store = makeStore();
        const view = mount(store, () => useCurrentProject({ lite: false }));
        const consoleError = jest.spyOn(console, 'error').mockImplementation();
        await act(async () => {
            pending[0](
                Object.assign(new Error('Forbidden'), { status: 403 }),
                null
            );
        });
        consoleError.mockRestore();
        expect(view.result.current.error.status).toBe(403);
        expect(view.result.current.project).toBeNull();
        expect(view.result.current.isLoading).toBe(false);
        expect(store.getState().data.projectRepresentations[7]).toBe('base');
        view.rerender();
        expect(request.get).toHaveBeenCalledTimes(1);
    });

    test('uses the umbrella base record for the portal root without loading details', () => {
        const project = { ...umbrella, archive_domain: window.location.origin };
        const view = mount(
            makeStore({ 1: project }),
            () => useCurrentProject(),
            '/de'
        );
        expect(view.result.current.project).toBe(project);
        expect(request.get).not.toHaveBeenCalled();
    });
});
