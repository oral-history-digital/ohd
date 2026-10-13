import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import request from 'superagent';

import { LOGGED_IN } from '../../user/action-types';
import userReducer from '../../user/reducer';
import { fetchData, receiveData } from './actions';
import { dataReducer } from './reducer';
import { getProjectRequests } from './selectors/baseSelectors';

// Use the real Redux store and loader. Mock only the HTTP requests.
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

const props = { locale: 'de', project: { id: 1, shortname: 'pilot' } };

function makeStore(data) {
    return createStore(
        combineReducers({ data: dataReducer, user: userReducer }),
        data ? { data } : undefined,
        applyMiddleware(thunk)
    );
}

describe('project detail requests', () => {
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

    function succeed(index = 0, id = 7) {
        const response = {
            id,
            data_type: 'projects',
            data: { id, shortname: 'archive', name: { de: 'Archiv' } },
        };
        pending[index](null, { status: 200, text: JSON.stringify(response) });
        return response;
    }

    test('concurrent consumers share a request and await the updated store', async () => {
        const store = makeStore();
        const first = store.dispatch(fetchData(props, 'projects', 7));
        const second = store.dispatch(fetchData(props, 'projects', '7'));

        expect(first).toBe(second);
        expect(request.get).toHaveBeenCalledTimes(1);
        expect(request.get).toHaveBeenCalledWith('/pilot/de/projects/7.json');
        expect(store.getState().data.statuses.projects[7]).toBe('fetching');
        expect(Object.values(getProjectRequests(store.getState()))).toEqual([
            { requestId: 1, status: 'pending', error: null },
        ]);

        const response = succeed();
        await expect(first).resolves.toEqual({ response, error: null });
        expect(store.getState().data.projects[7]).toEqual(response.data);
        expect(store.getState().data.statuses.projects[7]).toMatch(/^fetched/);
        expect(
            Object.values(getProjectRequests(store.getState()))[0].status
        ).toBe('succeeded');
    });

    test('a synchronous subscriber also shares the pending request', async () => {
        const store = makeStore();
        let second;
        const unsubscribe = store.subscribe(() => {
            second = store.dispatch(fetchData(props, 'projects', 7));
        });
        const first = store.dispatch(fetchData(props, 'projects', 7));
        unsubscribe();

        expect(second).toBe(first);
        expect(request.get).toHaveBeenCalledTimes(1);
        succeed();
        await first;
    });

    test('normalizes query order while keeping representations distinct', async () => {
        const store = makeStore();
        const first = store.dispatch(
            fetchData(props, 'projects', 7, null, 'lite=1&page=1')
        );
        const second = store.dispatch(
            fetchData(props, 'projects', 7, null, 'page=1&lite=1')
        );
        const detail = store.dispatch(fetchData(props, 'projects', 7));

        expect(first).toBe(second);
        expect(detail).not.toBe(first);
        expect(request.get).toHaveBeenCalledTimes(2);
        succeed(0);
        succeed(1);
        await Promise.all([first, detail]);
    });

    test('separates locales and project contexts, including dedicated domains', async () => {
        const store = makeStore();
        const requests = [
            store.dispatch(fetchData(props, 'projects', 7)),
            store.dispatch(
                fetchData({ ...props, locale: 'en' }, 'projects', 7)
            ),
            store.dispatch(
                fetchData(
                    { ...props, project: { id: 2, shortname: 'other' } },
                    'projects',
                    7
                )
            ),
            store.dispatch(
                fetchData(
                    {
                        ...props,
                        project: {
                            ...props.project,
                            archive_domain: 'https://a.example',
                        },
                    },
                    'projects',
                    7
                )
            ),
            store.dispatch(
                fetchData(
                    {
                        ...props,
                        project: {
                            id: 2,
                            shortname: 'other',
                            archive_domain: 'https://b.example',
                        },
                    },
                    'projects',
                    7
                )
            ),
        ];

        expect(request.get.mock.calls.map(([url]) => url)).toEqual([
            '/pilot/de/projects/7.json',
            '/pilot/en/projects/7.json',
            '/other/de/projects/7.json',
            '/de/projects/7.json',
            '/de/projects/7.json',
        ]);
        expect(Object.keys(getProjectRequests(store.getState()))).toHaveLength(
            5
        );
        requests.forEach((_, index) => succeed(index));
        await Promise.all(requests);
    });

    test('does not share promises between stores', async () => {
        const first = makeStore().dispatch(fetchData(props, 'projects', 7));
        const second = makeStore().dispatch(fetchData(props, 'projects', 7));

        expect(first).not.toBe(second);
        expect(request.get).toHaveBeenCalledTimes(2);
        succeed(0);
        succeed(1);
        await Promise.all([first, second]);
    });

    test('separates requests after a session change', async () => {
        const store = makeStore();
        const anonymous = store.dispatch(fetchData(props, 'projects', 7));
        store.dispatch({ type: LOGGED_IN });
        const authenticated = store.dispatch(fetchData(props, 'projects', 7));

        expect(anonymous).not.toBe(authenticated);
        expect(request.get).toHaveBeenCalledTimes(2);
        succeed(0);
        succeed(1);
        await Promise.all([anonymous, authenticated]);
    });

    test('separates requests for different current accounts in the same session', async () => {
        const store = makeStore();
        store.dispatch(
            receiveData({ id: 'current', data_type: 'users', data: { id: 10 } })
        );
        const first = store.dispatch(fetchData(props, 'projects', 7));
        store.dispatch(
            receiveData({ id: 'current', data_type: 'users', data: { id: 11 } })
        );
        const second = store.dispatch(fetchData(props, 'projects', 7));

        expect(first).not.toBe(second);
        expect(request.get).toHaveBeenCalledTimes(2);
        succeed(0);
        succeed(1);
        await Promise.all([first, second]);
    });

    test('tracks requests when starting from server data and preserves existing records', async () => {
        const { projectRequests, ...bootstrap } = dataReducer(undefined, {});
        expect(projectRequests).toEqual({});
        const people = { 20: { id: 20 } };
        const unrelated = { id: 8, shortname: 'unrelated' };
        const store = makeStore({
            ...bootstrap,
            projects: { 7: { id: 7, people }, 8: unrelated },
        });
        expect(getProjectRequests(store.getState())).toEqual({});
        const result = store.dispatch(fetchData(props, 'projects', 7));
        const key = Object.keys(getProjectRequests(store.getState()))[0];
        expect(JSON.parse(key)[0]).toBe(
            new URL('/pilot/de/projects/7.json', window.location.origin).href
        );
        succeed();
        await result;

        expect(store.getState().data.projects[7].people).toBe(people);
        expect(store.getState().data.projects[8]).toBe(unrelated);
    });

    test('clears pending state if the transport throws before starting', async () => {
        const store = makeStore();
        request.get.mockImplementationOnce(() => {
            throw new Error('Request could not start');
        });
        await expect(
            store.dispatch(fetchData(props, 'projects', 7))
        ).resolves.toEqual({
            response: null,
            error: { status: null, message: 'Request could not start' },
        });
        expect(
            Object.values(getProjectRequests(store.getState()))[0].status
        ).toBe('failed');
        const retry = store.dispatch(fetchData(props, 'projects', 7));
        succeed();
        await retry;
        expect(request.get).toHaveBeenCalledTimes(2);
    });

    test('detail placeholders preserve separately loaded records', async () => {
        const bootstrap = dataReducer(undefined, {});
        const people = { 20: { id: 20 } };
        const taskTypes = { 30: { id: 30 } };
        const store = makeStore({
            ...bootstrap,
            projects: { 7: { id: 7, people, task_types: taskTypes } },
        });
        const result = store.dispatch(fetchData(props, 'projects', 7));
        pending[0](null, {
            status: 200,
            text: JSON.stringify({
                id: 7,
                data_type: 'projects',
                data: {
                    id: 7,
                    shortname: 'archive',
                    people: {},
                    task_types: {},
                },
            }),
        });
        await result;
        expect(store.getState().data.projects[7].people).toBe(people);
        expect(store.getState().data.projects[7].task_types).toBe(taskTypes);
        expect(store.getState().data.projectRepresentations[7]).toBe('detail');
    });

    test('a mismatched envelope is rejected without updating project records', async () => {
        const store = makeStore();
        const result = store.dispatch(fetchData(props, 'projects', 7));
        pending[0](null, {
            status: 200,
            text: JSON.stringify({
                id: 8,
                data_type: 'projects',
                data: { id: 7, shortname: 'archive' },
            }),
        });
        const response = await result;
        expect(response.error.message).toContain('did not match');
        expect(store.getState().data.projects).toEqual({});
        expect(store.getState().data.projectRepresentations).toEqual({});
    });

    test('a base list does not replace loaded detail or unrelated project records', async () => {
        const bootstrap = dataReducer(undefined, {});
        const unrelated = { id: 8, shortname: 'unrelated' };
        const store = makeStore({ ...bootstrap, projects: { 8: unrelated } });
        const loading = store.dispatch(fetchData(props, 'projects', 7));
        succeed();
        await loading;
        const detail = store.getState().data.projects[7];
        const firstPage = receiveData({
            data_type: 'projects',
            extra_params: 'page_1',
            page: '1',
            result_pages_count: 2,
            data: {
                7: { id: 7, name: { de: 'Base' } },
                9: { id: 9, shortname: 'new' },
            },
        });
        store.dispatch(Object.freeze(firstPage));
        expect(store.getState().data.projects[7]).toBe(detail);
        expect(store.getState().data.projects[8]).toBe(unrelated);
        expect(store.getState().data.projects[9].shortname).toBe('new');
        expect(store.getState().data.projectRepresentations[7]).toBe('detail');
        expect(store.getState().data.projectRepresentations[9]).toBe('base');
        expect(firstPage.page).toBe('1');
        expect(Object.keys(firstPage.data)).toEqual(['7', '9']);
        expect(store.getState().data.statuses.projects.resultPagesCount).toBe(
            2
        );
        expect(store.getState().data.statuses.projects.page_1).toMatch(
            /^fetched/
        );

        store.dispatch(
            receiveData({
                data_type: 'projects',
                extra_params: 'page_2',
                page: '2',
                result_pages_count: 2,
                data: { 10: { id: 10, shortname: 'next' } },
            })
        );
        expect(store.getState().data.projects[7]).toBe(detail);
        expect(store.getState().data.projects[8]).toBe(unrelated);
        expect(store.getState().data.projects[9].shortname).toBe('new');
        expect(store.getState().data.projects[10].shortname).toBe('next');
        expect(store.getState().data.projectRepresentations[10]).toBe('base');
    });

    test.each([
        [
            'denied access',
            Object.assign(new Error('Forbidden'), { status: 403 }),
        ],
        ['transient failure', new Error('Network unavailable')],
    ])(
        'stores a structured error and permits retry after %s',
        async (_, error) => {
            const store = makeStore();
            const initial = store.dispatch(fetchData(props, 'projects', 7));
            succeed();
            await initial;
            const refresh = store.dispatch(fetchData(props, 'projects', 7));
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();
            pending[1](error, null);
            consoleErrorSpy.mockRestore();

            const failure = {
                status: error.status || null,
                message: error.message,
            };
            await expect(refresh).resolves.toEqual({
                response: null,
                error: failure,
            });
            expect(store.getState().data.projects[7].shortname).toBe('archive');
            expect(store.getState().data.statuses.projects[7]).toMatch(
                /^error/
            );
            expect(Object.values(getProjectRequests(store.getState()))).toEqual(
                [{ requestId: 2, status: 'failed', error: failure }]
            );

            const retry = store.dispatch(fetchData(props, 'projects', 7));
            expect(request.get).toHaveBeenCalledTimes(3);
            expect(
                Object.values(getProjectRequests(store.getState()))[0].error
            ).toBeNull();
            succeed(2);
            await retry;
        }
    );

    test.each([
        ['project list', 'projects', null, null],
        ['project nested resource', 'projects', 7, 'contact_email'],
        ['another resource', 'interviews', 'archive001', null],
    ])(
        'leaves the existing loading path intact for %s',
        (_, dataType, id, nested) => {
            const store = makeStore();
            const result = store.dispatch(
                fetchData(props, dataType, id, nested)
            );

            expect(result).toBeUndefined();
            expect(request.get).toHaveBeenCalledTimes(1);
            expect(getProjectRequests(store.getState())).toEqual({});
        }
    );
});
