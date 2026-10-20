import { act, renderHook, waitFor } from '@testing-library/react';
import Loader from 'modules/api/Loader';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { useCatalogProjects } from '../../explorer/hooks/useCatalogProjects';
import { LOGGED_IN, LOGOUT } from '../../user/action-types';
import userReducer from '../../user/reducer';
import { RECEIVE_DATA } from '../redux/action-types';
import {
    deleteData,
    receiveData,
    receiveMutationData,
    submitData,
} from '../redux/actions';
import { makeProjectSelector, projectDetailUrl } from '../redux/projectDetails';
import { makeProjectListSelector, projectListUrl } from '../redux/projectLists';
import { dataReducer } from '../redux/reducer';
import { fetchV2Data } from '../redux/v2Requests';
import { useProjectDetail } from './useProjectDetail';
import { useProjectList } from './useProjectList';

let mockLocale = 'de';
jest.mock('modules/i18n', () => ({ useI18n: () => ({ locale: mockLocale }) }));
jest.mock('modules/api/Loader', () => ({
    __esModule: true,
    default: {
        getJson: jest.fn(),
        put: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
    },
}));
jest.mock('modules/data', () => ({
    useProjectList: (...args) =>
        jest.requireActual('./useProjectList').useProjectList(...args),
}));

/**
 * Creates an independent store with legacy project data to check migration isolation.
 *
 * @returns {import('redux').Store} Redux store with thunk middleware and real reducers.
 */
function makeStore() {
    const state = dataReducer(undefined, {});
    return createStore(
        combineReducers({ data: dataReducer, user: userReducer }),
        {
            data: {
                ...state,
                projects: {
                    7: {
                        id: 7,
                        name: { en: 'Legacy name' },
                        collections: { 99: { id: 99 } },
                    },
                },
            },
            user: { isLoggedIn: false },
        },
        applyMiddleware(thunk)
    );
}

/**
 * Builds a project summary with catalog includes for request and merge tests.
 *
 * @param {number} [id=7] - Project ID.
 * @param {Object} [fields={}] - Values overriding the fixture defaults.
 * @returns {Object} Project summary used in mocked API responses.
 */
const project = (id = 7, fields = {}) => ({
    id,
    shortname: `project${id}`,
    name: 'Projekt',
    interview_counts: { public: 2, restricted: 1, unshared: 0, total: 3 },
    collection_counts: { public: 1, restricted: 0, total: 1 },
    interview_languages: ['eng'],
    ...fields,
});
/**
 * Wraps project fixtures in a v2 list response.
 *
 * @param {Object[]} data - Projects in response order.
 * @returns {Object} API envelope with one-page pagination.
 */
const payload = (data) => ({
    data,
    pagination: {
        page: 1,
        per_page: data.length,
        total_pages: 1,
        total_count: data.length,
    },
});

/**
 * Completes a captured Loader request by dispatching its success action.
 *
 * @param {Object[]} data - Project summaries returned by the request.
 * @param {number} [index] - Captured request index; defaults to the latest request.
 */
function complete(data, index = Loader.getJson.mock.calls.length - 1) {
    const [, , dispatch, success] = Loader.getJson.mock.calls[index];
    dispatch(success(payload(data)));
}

/**
 * Completes a detail request with one record instead of a list envelope.
 *
 * @param {Object} data - Project display details.
 * @param {number} [index] - Captured request index; defaults to the latest request.
 */
function completeDetail(data, index = Loader.getJson.mock.calls.length - 1) {
    const [, , dispatch, success] = Loader.getJson.mock.calls[index];
    dispatch(success({ data }));
}

/**
 * Dispatches a list request directly for request-sharing and reducer tests.
 *
 * @param {import('redux').Store} store - Store receiving request actions.
 * @param {string} [language='de'] - Requested display locale.
 * @param {import('../redux/projectLists').ProjectListOptions} [options={all: true}] - List query.
 * @param {boolean} [refresh=false] - Force a new fetch for a completed list.
 * @returns {Promise<import('../redux/v2Requests').V2ReadResult>} Shared request result.
 */
function load(
    store,
    language = 'de',
    options = { all: true },
    refresh = false
) {
    const url = projectListUrl(language, options);
    return store.dispatch(
        fetchV2Data('projects', url, { locale: language, refresh })
    );
}

/**
 * Renders a hook against an independent Redux store.
 *
 * @param {import('redux').Store} store - Store provided to the hook.
 * @param {Function} [hook=useProjectList] - Hook or hook-composing test callback.
 * @returns {Object} Testing Library hook result and rerender/unmount controls.
 */
function mount(store, hook = useProjectList) {
    return renderHook(hook, {
        wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
        ),
    });
}

beforeEach(() => {
    mockLocale = 'de';
    jest.clearAllMocks();
});

test('does not load hidden sidebar data until the catalog needs it', () => {
    const store = makeStore();
    let enabled = false;
    const { result, rerender } = mount(store, () =>
        useCatalogProjects({ enabled })
    );
    expect(Loader.getJson).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    enabled = true;
    rerender();
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
    act(() => complete([project()]));
    expect(result.current.projects).toHaveLength(1);
});

test('legacy save and delete callbacks invalidate catalog data after the server responds', () => {
    const store = makeStore();
    const { result } = mount(store);
    act(() => complete([project()]));
    const props = {
        locale: 'de',
        project: { shortname: 'pilot', archive_domain: 'https://example.test' },
    };
    act(() =>
        store.dispatch(
            submitData(props, { project: { id: 7, name: 'Edited' } })
        )
    );
    const put = Loader.put.mock.calls[0];
    act(() =>
        put[2](put[3]({ data_type: 'projects', id: 7, data: { id: 7 } }))
    );
    expect(result.current.projects).toEqual([]);
    act(() => complete([project(7, { name: 'Edited' })]));
    act(() => store.dispatch(deleteData(props, 'projects', 7)));
    act(() =>
        complete([project(7, { name: 'Still on server during delete' })])
    );
    const deletion = Loader.delete.mock.calls[0];
    act(() => deletion[1](deletion[2]({})));
    expect(result.current.projects).toEqual([]);
    act(() => complete([]));
    expect(result.current.projects).toEqual([]);
    expect(result.current.isLoading).toBe(false);
});

test('normalizes query identity, shares concurrent requests, and keeps stores independent', async () => {
    const store = makeStore();
    const first = load(store, 'de', {
        all: true,
        include: ['institutions', 'counts', 'counts'],
    });
    const second = load(store, 'de', {
        all: true,
        include: ['counts', 'institutions'],
    });
    expect(second).toBe(first);
    const other = makeStore();
    const separate = load(other, 'de', {
        all: true,
        include: ['counts', 'institutions'],
    });
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    complete([project()], 0);
    await first;
    expect(other.getState().data.v2.projects.records).toEqual({});
    complete([project(8)], 1);
    await separate;
    expect(store.getState().data.projects[7].name).toEqual({
        en: 'Legacy name',
    });
});

test('a synchronous subscriber shares the pending request', () => {
    const store = makeStore();
    let duplicate;
    const unsubscribe = store.subscribe(() => {
        duplicate = load(store);
    });
    const first = load(store);
    unsubscribe();
    expect(duplicate).toBe(first);
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
    complete([project()]);
});

test('keeps locales, list order, and unrelated records separate while merging optional fields', () => {
    const store = makeStore();
    load(store);
    complete([
        project(8),
        project(7, {
            institutions: [{ id: 5, name: 'Institut' }],
            logo: { id: 9, url: '/de.png' },
        }),
    ]);
    load(store, 'en');
    complete([project(7, { name: 'English', logo: null })]);
    load(store, 'de', { page: 2 });
    complete([{ id: 7, shortname: 'project7', name: null }]);
    const state = store.getState();
    const select = makeProjectListSelector();
    const german = select(state, projectListUrl('de', { all: true }), 'de');
    expect(german.projects.map(({ id }) => id)).toEqual([8, 7]);
    expect(german.projects[1]).toMatchObject({
        name: null,
        institutions: [{ name: 'Institut' }],
        logo: { url: '/de.png' },
    });
    expect(
        select(state, projectListUrl('en', { all: true }), 'en').projects[0]
    ).toMatchObject({ name: 'English', logo: null });
    expect(state.data.v2.projects.records[7]).not.toHaveProperty('name');
    expect(state.data.v2.projects.translations.stored).toEqual({});
});

test('catalog callers share v2 records without aliases or filtering unpublished projects', async () => {
    const store = makeStore();
    const { result } = mount(store, () => [
        useCatalogProjects(),
        useCatalogProjects(),
    ]);
    expect(result.current[0].isLoading).toBe(true);
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
    const url = Loader.getJson.mock.calls[0][0];
    expect(url).toContain('/api/v2/projects?');
    expect(url).toContain('all=true');
    expect(url).not.toContain('workflow_state');
    expect(
        new URL(url, 'http://example.test').searchParams.get('include')
    ).toBe('collection_preview,counts,institutions,interview_languages');
    act(() => complete([project(7, { workflow_state: 'unshared' })]));
    await waitFor(() => expect(result.current[0].isLoading).toBe(false));
    expect(result.current[0].projects).toEqual(result.current[1].projects);
    expect(result.current[0].projects[0]).toMatchObject({
        workflow_state: 'unshared',
        interview_counts: { total: 3 },
        collection_counts: { total: 1 },
        interview_languages: ['eng'],
    });
    expect(result.current[0].projects[0]).not.toHaveProperty('interviews');
    expect(result.current[0].projects[0]).not.toHaveProperty('collections');
    expect(result.current[0].projects[0]).not.toHaveProperty(
        'languages_interviews'
    );
});

test('switches locale, keeps results during refresh, and reuses a completed request', async () => {
    const store = makeStore();
    const { result, rerender } = mount(store);
    act(() => complete([project()]));
    const before = Loader.getJson.mock.calls.length;
    await act(async () => {
        await store.dispatch(
            fetchV2Data('projects', projectListUrl('de'), { locale: 'de' })
        );
    });
    expect(Loader.getJson).toHaveBeenCalledTimes(before);
    act(() => {
        result.current.mutate();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isValidating).toBe(true);
    act(() => complete([project(7, { name: 'Updated' })]));
    mockLocale = 'en';
    rerender();
    expect(result.current.projects).toEqual([]);
    act(() => complete([project(7, { name: 'English' })]));
    expect(result.current.projects[0].name).toBe('English');
});

test('exposes errors without retry loops and permits explicit retry', async () => {
    const store = makeStore();
    const { result } = mount(store);
    const [, , dispatch, , fail] = Loader.getJson.mock.calls[0];
    act(() => dispatch(fail({ status: 403, message: 'Denied' })));
    expect(result.current).toMatchObject({
        isLoading: false,
        error: { status: 403, message: 'Denied' },
    });
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
    act(() => {
        result.current.mutate();
    });
    act(() => complete([]));
    await waitFor(() => expect(result.current.error).toBeNull());
});

test('rejects invalid envelopes and handles synchronous transport failures', async () => {
    const store = makeStore();
    const promise = load(store);
    const [, , dispatch, success] = Loader.getJson.mock.calls[0];
    dispatch(success({ data: [{ id: '7' }], pagination: {} }));
    await expect(promise).resolves.toMatchObject({
        error: { message: 'Invalid list response.' },
    });
    Loader.getJson.mockImplementationOnce(() => {
        throw new Error('Offline');
    });
    await expect(load(store)).resolves.toMatchObject({
        error: { message: 'Offline' },
    });
});

test.each([LOGOUT, LOGGED_IN])(
    'rejects pre-access-change responses after %s',
    async (type) => {
        const store = makeStore();
        const pending = load(store);
        store.dispatch({ type });
        complete([
            project(7, {
                collection_preview: [{ id: 99, notes: 'Protected' }],
            }),
        ]);
        await pending;
        expect(store.getState().data.v2.projects.records).toEqual({});
        expect(
            makeProjectListSelector()(
                store.getState(),
                projectListUrl('de', { all: true }),
                'de'
            ).projects
        ).toEqual([]);
    }
);

test('account and mutation changes clear data, refetch mounted lists, and reject older responses', () => {
    const store = makeStore();
    const { result } = mount(store);
    act(() => complete([project()]));
    act(() =>
        store.dispatch(
            receiveData({
                data_type: 'users',
                id: 'current',
                data: { id: 2, permissions: {} },
            })
        )
    );
    expect(result.current.projects).toEqual([]);
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    const old = Loader.getJson.mock.calls[1];
    act(() =>
        store.dispatch({
            type: RECEIVE_DATA,
            mutation: true,
            dataType: 'projects',
            id: 7,
            data: { id: 7 },
        })
    );
    expect(Loader.getJson).toHaveBeenCalledTimes(3);
    act(() => old[2](old[3](payload([project(7, { name: 'Stale' })]))));
    expect(result.current.projects).toEqual([]);
    act(() => complete([project(7, { name: 'Fresh' })]));
    expect(result.current.projects[0].name).toBe('Fresh');
});

test.each(['mark_text', 'speaker_designations'])(
    'queued %s work keeps project views loaded while recording processing status',
    (nestedDataType) => {
        const store = makeStore();
        const { result } = mount(store, () => ({
            list: useProjectList(),
            detail: useProjectDetail(7, {
                include: ['registry_configuration'],
            }),
        }));
        act(() => {
            complete([project()], 0);
            completeDetail(project(7, { root_registry_entry_id: 9 }), 1);
        });
        const cachedProjects = store.getState().data.v2.projects;
        act(() =>
            store.dispatch(
                receiveMutationData({
                    msg: 'processing',
                    id: 'pilot001',
                    data_type: 'interviews',
                    nested_data_type: nestedDataType,
                    extra_params: 'for_interviews_pilot001',
                })
            )
        );
        expect(
            store.getState().data.statuses[nestedDataType]
                .for_interviews_pilot001
        ).toBe('processing');
        expect(store.getState().data.v2.projects).toBe(cachedProjects);
        expect(result.current.detail).toMatchObject({
            isLoading: false,
            project: { id: 7, root_registry_entry_id: 9 },
        });
        expect(result.current.list.projects).toHaveLength(1);
        expect(Loader.getJson).toHaveBeenCalledTimes(2);

        act(() =>
            store.dispatch(
                receiveMutationData({
                    archive_id: 'pilot001',
                    data_type: 'interviews',
                    data: { id: 99 },
                })
            )
        );
        expect(result.current.detail.project).toBeUndefined();
        expect(result.current.list.projects).toEqual([]);
        expect(Loader.getJson).toHaveBeenCalledTimes(4);
    }
);

test('detail callers share a normalized request and keep query results out of list membership', () => {
    const store = makeStore();
    const { result } = mount(store, () => [
        useProjectDetail(7, { include: ['subjects', 'counts', 'subjects'] }),
        useProjectDetail('7', { include: ['counts', 'subjects'] }),
    ]);
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
    expect(Loader.getJson.mock.calls[0][0]).toBe(
        projectDetailUrl(7, 'de', { include: ['subjects', 'counts'] })
    );
    expect(result.current[0].isLoading).toBe(true);
    act(() =>
        completeDetail(
            project(7, { more_text: 'Details', subjects: ['Geschichte'] })
        )
    );
    expect(result.current[0].project).toEqual(result.current[1].project);
    expect(result.current[0].project.more_text).toBe('Details');
    expect(store.getState().data.v2.projects.lists).toEqual({});
    expect(store.getState().data.projects[7].name).toEqual({
        en: 'Legacy name',
    });
});

test('loads details after a summary and preserves localized details when later summaries arrive', () => {
    const store = makeStore();
    load(store);
    complete([project(7), project(8)]);
    const { result, rerender } = mount(store, () => useProjectDetail(7));
    expect(result.current.project).toBeUndefined();
    act(() =>
        completeDetail(
            project(7, {
                more_text: 'Mehr',
                subjects: ['Erinnerung'],
                levels_of_indexing: [{ descriptor: 'Transkript', count: 1 }],
                cooperation_partners: [{ name: 'Partner DE' }],
                leaders: [{ name: 'Leitung' }],
                managers: [],
                funders: [],
                domain: 'https://archive.test',
            })
        )
    );
    mockLocale = 'en';
    rerender();
    expect(result.current.project).toBeUndefined();
    act(() =>
        completeDetail(
            project(7, {
                more_text: 'More',
                subjects: ['Memory'],
                leaders: [{ name: 'Leader' }],
            })
        )
    );
    mockLocale = 'de';
    rerender();
    expect(result.current.project).toMatchObject({
        more_text: 'Mehr',
        subjects: ['Erinnerung'],
        leaders: [{ name: 'Leitung' }],
    });
    act(() => {
        load(store, 'de', { all: true }, true);
        complete([project(7, { name: 'Neuer Name' })]);
    });
    expect(result.current.project).toMatchObject({
        name: 'Neuer Name',
        more_text: 'Mehr',
        domain: 'https://archive.test',
    });
    const saved = store.getState().data.v2.projects;
    expect(saved.records[8]).toBeDefined();
    for (const field of [
        'more_text',
        'subjects',
        'levels_of_indexing',
        'cooperation_partners',
        'leaders',
        'managers',
        'funders',
    ])
        expect(saved.records[7]).not.toHaveProperty(field);
});

test('detail identifier and include changes require their own response and refresh keeps loaded details visible', () => {
    const store = makeStore();
    let id = null;
    let include = [];
    const { result, rerender } = mount(store, () =>
        useProjectDetail(id, { include })
    );
    expect(Loader.getJson).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    id = 7;
    rerender();
    act(() => completeDetail(project()));
    include = ['institutions'];
    rerender();
    expect(result.current.project).toBeUndefined();
    act(() =>
        completeDetail(
            project(7, { institutions: [{ id: 5, name: 'Institute' }] })
        )
    );
    act(() => {
        result.current.mutate();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isValidating).toBe(true);
    expect(result.current.project.id).toBe(7);
    act(() => completeDetail(project(7, { name: 'Updated' })));
    id = 8;
    rerender();
    expect(result.current.project).toBeUndefined();
    act(() => completeDetail(project(8)));
    id = 7;
    const requests = Loader.getJson.mock.calls.length;
    rerender();
    expect(result.current.project.name).toBe('Updated');
    expect(Loader.getJson).toHaveBeenCalledTimes(requests);
});

test('denied detail refresh hides cached details without retry loops and supports explicit retry', () => {
    const store = makeStore();
    const { result } = mount(store, () => useProjectDetail(7));
    act(() => completeDetail(project()));
    act(() => {
        result.current.mutate();
    });
    const [, , dispatch, , fail] = Loader.getJson.mock.calls[1];
    act(() => dispatch(fail({ status: 403, message: 'Denied' })));
    expect(result.current).toMatchObject({
        project: undefined,
        isLoading: false,
        error: { status: 403 },
    });
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    act(() => {
        result.current.mutate();
    });
    act(() => completeDetail(project(7, { name: 'Accessible again' })));
    expect(result.current.project.name).toBe('Accessible again');
    expect(result.current.error).toBeNull();
});

test.each([
    LOGOUT,
    LOGGED_IN,
    'affiliate mutation',
    'person mutation',
    'registry mutation',
])(
    'detail invalidation refetches and rejects stale responses after %s',
    async (change) => {
        const store = makeStore();
        const { result } = mount(store, () => useProjectDetail(7));
        const old = Loader.getJson.mock.calls[0];
        const resource = {
            'affiliate mutation': 'leaders',
            'person mutation': 'people',
            'registry mutation': 'registry_names',
        }[change];
        act(() =>
            store.dispatch(
                resource
                    ? {
                          type: RECEIVE_DATA,
                          mutation: true,
                          dataType: resource,
                          data: {},
                      }
                    : { type: change }
            )
        );
        expect(Loader.getJson).toHaveBeenCalledTimes(2);
        act(() =>
            old[2](
                old[3]({
                    data: project(7, { more_text: 'Stale protected text' }),
                })
            )
        );
        expect(result.current.project).toBeUndefined();
        act(() => completeDetail(project(7, { more_text: 'Fresh' })));
        expect(result.current.project.more_text).toBe('Fresh');
    }
);

test.each([null, [], { id: '7' }, { id: -1 }])(
    'rejects invalid detail record %p',
    async (data) => {
        const store = makeStore();
        const promise = store.dispatch(
            fetchV2Data('projects', projectDetailUrl(7, 'de'), {
                locale: 'de',
                single: true,
            })
        );
        completeDetail(data);
        await expect(promise).resolves.toMatchObject({
            error: { message: 'Invalid record response.' },
        });
        expect(store.getState().data.v2.projects.records).toEqual({});
    }
);

test('cached project selection updates from list and detail responses without starting requests', () => {
    const store = makeStore();
    const select = makeProjectSelector();
    expect(select(store.getState(), '7', 'de')).toBeUndefined();
    expect(Loader.getJson).not.toHaveBeenCalled();
    load(store);
    complete([project(7, { name: 'Zusammenfassung' })]);
    const summary = select(store.getState(), '7', 'de');
    expect(summary.name).toBe('Zusammenfassung');
    expect(select(store.getState(), '7', 'de')).toBe(summary);
    expect(select(store.getState(), '8', 'de')).toBeUndefined();
    expect(select(store.getState(), '7', 'en')).toBeUndefined();
    expect(Loader.getJson).toHaveBeenCalledTimes(1);

    store.dispatch(
        fetchV2Data('projects', projectDetailUrl(7, 'de'), {
            locale: 'de',
            single: true,
        })
    );
    completeDetail(project(7, { name: 'Details' }));
    expect(select(store.getState(), '7', 'de').name).toBe('Details');
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
});

test('cached project selection hides names after access changes or logout', () => {
    const store = makeStore();
    load(store);
    complete([project()]);
    const select = makeProjectSelector();
    const state = store.getState();
    expect(select(state, 7, 'de').name).toBe('Projekt');
    expect(
        select({ ...state, user: { isLoggedIn: true } }, 7, 'de')
    ).toBeUndefined();
    store.dispatch({ type: LOGOUT });
    expect(select(store.getState(), 7, 'de')).toBeUndefined();
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
});

test('edit callers share requests but display responses do not satisfy edit loading', () => {
    const store = makeStore();
    let profile = 'display';
    const { result, rerender } = mount(store, () => [
        useProjectDetail(7, { profile }),
        useProjectDetail(7, { profile }),
    ]);
    act(() => completeDetail(project()));
    expect(projectDetailUrl(7, 'de', { profile: 'display' })).toBe(
        projectDetailUrl(7, 'de')
    );
    profile = 'edit';
    rerender();
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    expect(Loader.getJson.mock.calls[1][0]).toContain('profile=edit');
    expect(result.current[0].project).toBeUndefined();
    expect(result.current[0].isLoading).toBe(true);
    act(() =>
        completeDetail(project(7, { contact_email: 'editor@example.org' }))
    );
    expect(result.current[0].project.contact_email).toBe('editor@example.org');
    expect(result.current[0].project).toEqual(result.current[1].project);
    profile = 'display';
    rerender();
    expect(result.current[0].project).not.toHaveProperty('contact_email');
    expect(result.current[0].project).not.toHaveProperty('edit');
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
});

test('display and footer responses preserve full editing data without exposing it to display readers', () => {
    const store = makeStore();
    let profile = 'edit';
    let include = [
        'translations',
        ' branding ',
        'footer',
        'external_links',
        'playback',
        'access_config',
    ];
    const { result, rerender } = mount(store, () =>
        useProjectDetail(7, { profile, include })
    );
    const translations = [{ id: 1, locale: 'en', name: '', more_text: null }];
    const full = project(7, {
        contact_email: 'editor@example.org',
        translations,
        access_config: { id: 3, organization: { display: true } },
        media_streams: [{ id: 4, path: 'protected-template', suffix: 'mp4' }],
        external_links: [
            {
                id: 5,
                name: 'Link',
                internal_name: 'Internal',
                translations: [],
            },
        ],
        logos: [{ id: 6, locale: 'de', filename: 'logo.png' }],
        sponsor_logos: [{ id: 9, locale: 'en', filename: 'sponsor.png' }],
    });
    act(() => completeDetail(full));
    expect(result.current.project).toEqual(full);
    const displayFields = {
        access_config: { organization: { display: true } },
        media_streams: [{ id: 4, suffix: 'mp4' }],
        external_links: [{ id: 5, name: 'Link' }],
        sponsor_logos: [],
    };
    profile = 'display';
    include = ['footer', 'playback', 'access_config'];
    rerender();
    act(() => completeDetail(project(7, displayFields)));
    expect(result.current.project).toEqual(project(7, displayFields));
    act(() => {
        load(store);
        complete([project()]);
    });
    const cached = makeProjectSelector()(store.getState(), 7, 'de');
    expect(cached).not.toHaveProperty('contact_email');
    expect(cached).not.toHaveProperty('logos');
    expect(cached).not.toHaveProperty('translations');
    expect(
        makeProjectListSelector()(
            store.getState(),
            projectListUrl('de', { all: true }),
            'de'
        ).projects[0]
    ).toEqual(cached);
    profile = 'edit';
    include = ['footer'];
    rerender();
    act(() =>
        completeDetail(
            project(7, {
                contact_email: 'editor@example.org',
                external_links: displayFields.external_links,
                sponsor_logos: [],
            })
        )
    );
    expect(result.current.project.external_links).toEqual(
        displayFields.external_links
    );
    expect(result.current.project.sponsor_logos).toEqual([]);
    include = [
        'translations',
        'branding',
        'footer',
        'external_links',
        'playback',
        'access_config',
    ];
    rerender();
    expect(result.current.project).toEqual(full);
    expect(store.getState().data.v2.projects.translations.stored[7]).toEqual(
        translations
    );
});

test('form and registry configuration stays shared across display and edit reads', () => {
    const store = makeStore();
    let profile = 'edit';
    const include = ['form_options', 'registry_configuration'];
    const { result, rerender } = mount(store, () =>
        useProjectDetail(7, { profile, include })
    );
    const initial = {
        archive_id_number_length: 4,
        upload_types: ['bulk_metadata'],
        logged_out_visible_registry_entry_ids: ['11'],
        hidden_registry_entry_ids: ['12'],
        hidden_transcript_registry_entry_ids: ['13'],
    };
    act(() =>
        completeDetail(
            project(7, {
                ...initial,
                contact_email: 'editor@example.org',
            })
        )
    );
    const record = store.getState().data.v2.projects.records[7];
    expect(record).toMatchObject(initial);
    expect(record.edit).toEqual({ contact_email: 'editor@example.org' });

    profile = 'display';
    rerender();
    expect(result.current.project).toBeUndefined();
    const updated = {
        archive_id_number_length: null,
        upload_types: [],
        logged_out_visible_registry_entry_ids: [],
        hidden_registry_entry_ids: ['22'],
        hidden_transcript_registry_entry_ids: ['23'],
    };
    act(() => completeDetail(project(7, updated)));
    expect(result.current.project).toMatchObject(updated);
    expect(result.current.project).not.toHaveProperty('contact_email');

    profile = 'edit';
    rerender();
    expect(result.current.project).toMatchObject({
        ...updated,
        contact_email: 'editor@example.org',
    });
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    act(() => {
        load(store);
        complete([project()]);
    });
    expect(result.current.project).toMatchObject(updated);
    expect(makeProjectSelector()(store.getState(), 7, 'de')).not.toHaveProperty(
        'contact_email'
    );
});

test('new localized includes retain their language and editing translations independently', () => {
    const store = makeStore();
    let profile = 'display';
    const include = [
        'texts',
        'metadata_fields',
        'map_sections',
        'footer',
        'playback',
        'affiliates',
    ];
    const { result, rerender } = mount(store, () =>
        useProjectDetail(7, { profile, include })
    );
    const fields = {
        texts: [{ id: 1, text: 'Deutsch' }],
        metadata_fields: [{ id: 2, label: 'Deutsch' }],
        map_sections: [{ id: 3, label: 'Deutsch' }],
        external_links: [{ id: 4, name: 'Deutsch' }],
        sponsor_logos: [{ id: 5, locale: 'de' }],
        media_missing_text: 'Deutsch',
    };
    act(() => completeDetail(project(7, fields)));
    mockLocale = 'en';
    rerender();
    act(() =>
        completeDetail(
            project(
                7,
                Object.fromEntries(
                    Object.keys(fields).map((field) => [field, null])
                )
            )
        )
    );
    profile = 'edit';
    rerender();
    act(() =>
        completeDetail(
            project(7, {
                texts: [
                    {
                        id: 1,
                        text: 'English',
                        translations: [{ locale: 'en', text: '' }],
                    },
                ],
            })
        )
    );
    mockLocale = 'de';
    profile = 'display';
    rerender();
    expect(result.current.project).toMatchObject(fields);
    profile = 'edit';
    rerender();
    act(() =>
        completeDetail(
            project(7, {
                texts: [
                    {
                        id: 1,
                        text: 'Deutsch',
                        translations: [{ locale: 'de', text: null }],
                    },
                ],
            })
        )
    );
    expect(result.current.project.texts[0].translations).toEqual([
        { locale: 'de', text: null },
    ]);
    mockLocale = 'en';
    rerender();
    expect(result.current.project.texts[0].translations).toEqual([
        { locale: 'en', text: '' },
    ]);
    const records = store.getState().data.v2.projects.records[7];
    for (const field of Object.keys(fields))
        expect(records).not.toHaveProperty(field);
});

test('denied edit refresh hides editing values while display data remains usable', () => {
    const store = makeStore();
    const { result } = mount(store, () =>
        useProjectDetail(7, { profile: 'edit' })
    );
    act(() =>
        completeDetail(project(7, { contact_email: 'editor@example.org' }))
    );
    act(() => {
        result.current.mutate();
    });
    const [, , dispatch, , fail] = Loader.getJson.mock.calls[1];
    act(() => dispatch(fail({ status: 403, message: 'Denied' })));
    expect(result.current.project).toBeUndefined();
    expect(result.current.error.status).toBe(403);
    expect(Loader.getJson).toHaveBeenCalledTimes(2);
    expect(makeProjectSelector()(store.getState(), 7, 'de')).not.toHaveProperty(
        'contact_email'
    );
});

test.each([
    'sponsor_logos',
    'media_streams',
    'external_links',
    'access_configs',
    'metadata_fields',
    'texts',
    'map_sections',
])(
    '%s delete completion clears edit data and rejects responses from before invalidation',
    (resource) => {
        const store = makeStore();
        const { result } = mount(store, () =>
            useProjectDetail(7, { profile: 'edit' })
        );
        act(() =>
            completeDetail(project(7, { contact_email: 'old@example.org' }))
        );
        act(() => {
            result.current.mutate();
        });
        const old = Loader.getJson.mock.calls[1];
        act(() =>
            store.dispatch(
                deleteData(
                    { locale: 'de', project: { shortname: 'pilot' } },
                    resource,
                    42,
                    null,
                    null,
                    true
                )
            )
        );
        const deletion = Loader.delete.mock.calls[0];
        act(() =>
            deletion[1](
                deletion[2]({ data_type: 'projects', id: 7, data: { id: 7 } })
            )
        );
        expect(Loader.getJson).toHaveBeenCalledTimes(3);
        expect(result.current.project).toBeUndefined();
        act(() =>
            old[2](
                old[3]({
                    data: project(7, { contact_email: 'stale@example.org' }),
                })
            )
        );
        expect(store.getState().data.v2.projects.records).toEqual({});
        act(() =>
            completeDetail(project(7, { contact_email: 'fresh@example.org' }))
        );
        expect(result.current.project.contact_email).toBe('fresh@example.org');
    }
);

test.each(['logout', 'permission change'])(
    '%s removes edit translations and rejects pending protected responses',
    (change) => {
        const store = makeStore();
        const { result } = mount(store, () =>
            useProjectDetail(7, { profile: 'edit', include: ['translations'] })
        );
        act(() =>
            completeDetail(
                project(7, {
                    contact_email: 'old@example.org',
                    translations: [{ locale: 'de', name: 'Stored' }],
                })
            )
        );
        act(() => {
            result.current.mutate();
        });
        const old = Loader.getJson.mock.calls[1];
        act(() =>
            store.dispatch(
                change === 'logout'
                    ? { type: LOGOUT }
                    : receiveData({
                          data_type: 'users',
                          id: 'current',
                          data: { id: 2, permissions: {} },
                      })
            )
        );
        act(() =>
            old[2](
                old[3]({
                    data: project(7, {
                        contact_email: 'stale@example.org',
                        translations: [{ locale: 'de', name: 'Stale' }],
                    }),
                })
            )
        );
        expect(result.current.project).toBeUndefined();
        expect(store.getState().data.v2.projects.translations.stored).toEqual(
            {}
        );
    }
);
