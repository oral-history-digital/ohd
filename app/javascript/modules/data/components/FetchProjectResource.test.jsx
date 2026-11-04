/* eslint-disable react/prop-types */
import { act, render, screen } from '@testing-library/react';
import Loader from 'modules/api/Loader';
import { useProjectIdentity } from 'modules/routes';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { LOGOUT } from '../../user/action-types';
import userReducer from '../../user/reducer';
import { REMOVE_DATA } from '../redux/action-types';
import { fetchProjectData } from '../redux/projectRequests';
import { dataReducer } from '../redux/reducer';
import { FetchProjectResource } from './FetchProjectResource';

jest.mock('modules/routes', () => ({
    useProjectIdentity: jest.fn(),
    usePathBase: () => '/pilot/en',
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'en', t: (key) => key }),
}));
jest.mock('modules/spinners', () => ({
    Spinner: () => <p role="status">Loading</p>,
}));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('modules/api/Loader', () => ({
    __esModule: true,
    default: { getJson: jest.fn() },
}));

/**
 * Builds a store containing stale nested data to verify replacement and isolation.
 *
 * @returns {Object} Redux store with the real project request reducers.
 */
function makeStore() {
    return createStore(
        combineReducers({ data: dataReducer, user: userReducer }),
        {
            data: {
                ...dataReducer(undefined, {}),
                projects: {
                    ...dataReducer(undefined, {}).projects,
                    resources: {
                        7: {
                            collections: { 1: { id: 1 } },
                            contribution_types: { 3: { id: 3 } },
                        },
                        9: { collections: { 2: { id: 2 } } },
                    },
                },
            },
            user: { isLoggedIn: true },
        },
        applyMiddleware(thunk)
    );
}

/**
 * Delivers a project-owned collection list to a captured request.
 *
 * @param {Object} [fields={}] - Envelope overrides for validation tests.
 * @param {number} [index=0] - Request to complete.
 */
function complete(fields = {}, index = 0) {
    const [, , dispatch, success] = Loader.getJson.mock.calls[index];
    dispatch(
        success({
            data_type: 'projects',
            nested_data_type: 'collections',
            id: 7,
            data: { 4: { id: 4 } },
            ...fields,
        })
    );
}

beforeEach(() => {
    jest.clearAllMocks();
    useProjectIdentity.mockReturnValue({ projectDbId: 7 });
});

test('waits for identity, shares requests, and replaces only the requested project resource', () => {
    const store = makeStore();
    useProjectIdentity.mockReturnValue({});
    /** @returns {React.ReactElement} Consumers sharing the same scoped request. */
    const view = () => (
        <Provider store={store}>
            <FetchProjectResource resource="collections">
                <span>Editor</span>
            </FetchProjectResource>
            <FetchProjectResource resource="collections">
                <span>Citation</span>
            </FetchProjectResource>
        </Provider>
    );
    const { rerender } = render(view());
    expect(Loader.getJson).not.toHaveBeenCalled();
    useProjectIdentity.mockReturnValue({ projectDbId: 7 });
    rerender(view());
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Editor')).not.toBeInTheDocument();
    act(() => complete());
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByText('Citation')).toBeInTheDocument();
    expect(store.getState().data.projects.resources).toEqual({
        7: {
            collections: { 4: { id: 4 } },
            contribution_types: { 3: { id: 3 } },
        },
        9: { collections: { 2: { id: 2 } } },
    });
    expect(store.getState().data.projects.records).toEqual({});
});

test.each([LOGOUT, REMOVE_DATA])(
    'discards in-flight resource responses after %s',
    (type) => {
        const store = makeStore();
        store.dispatch(
            fetchProjectData(
                'projects',
                '/pilot/en/collections.json?for_projects=7',
                {
                    projectResource: 'collections',
                    projectId: 7,
                }
            )
        );
        store.dispatch({ type, dataType: 'collections', id: 99 });
        complete();
        expect(store.getState().data.projects.resources[7].collections).toEqual(
            {
                1: { id: 1 },
            }
        );
    }
);

test('hides retained lists after logout and displays denied refresh errors without retrying', () => {
    const store = makeStore();
    render(
        <Provider store={store}>
            <FetchProjectResource resource="collections">
                <span>Editor</span>
            </FetchProjectResource>
        </Provider>
    );
    act(() => complete());
    expect(screen.getByText('Editor')).toBeInTheDocument();
    act(() => store.dispatch({ type: LOGOUT }));
    expect(screen.queryByText('Editor')).not.toBeInTheDocument();
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    act(() => {
        const [, , dispatch, , fail] = Loader.getJson.mock.lastCall;
        dispatch(fail({ status: 403, message: 'Forbidden' }));
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Forbidden');
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
});

test.each([
    { id: 9 },
    { nested_data_type: 'contribution_types' },
    { data: null },
    { data: { 4: { id: '4' } } },
])('rejects mismatched or malformed resource responses: %j', (fields) => {
    const store = makeStore();
    render(
        <Provider store={store}>
            <FetchProjectResource resource="collections">
                <span>Editor</span>
            </FetchProjectResource>
        </Provider>
    );
    act(() => complete(fields));
    expect(screen.getByRole('alert')).toHaveTextContent(
        'Invalid project resource response.'
    );
    expect(store.getState().data.projects.resources[7].collections).toEqual({
        1: { id: 1 },
    });
});

test('adapts registry-name lists to the same nested records used by mutations', () => {
    const store = makeStore();
    store.dispatch(
        fetchProjectData(
            'projects',
            '/pilot/en/registry_name_types.json?for_projects=7',
            {
                projectResource: 'registry_name_types',
                projectId: 7,
            }
        )
    );
    complete({
        data_type: 'registry_name_types',
        nested_data_type: undefined,
        id: undefined,
        extra_params: 'for_projects_7',
    });
    expect(
        store.getState().data.projects.resources[7].registry_name_types
    ).toEqual({
        4: { id: 4 },
    });
});
