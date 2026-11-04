import {
    makeProjectDetailSelector,
    projectDetailUrl,
} from '../modules/data/redux/projectDetails';
import { projectAccessContext } from '../modules/data/redux/projectRequests';
import archiveStore from './archiveStore';

jest.mock('modules/api', () => ({
    apiMiddleware: () => (next) => (action) => next(action),
}));
jest.mock('modules/data', () => ({
    initializeProjects: jest.requireActual('../modules/data/redux/actions')
        .initializeProjects,
}));
jest.mock('./combinedReducers', () => {
    const { combineReducers } = jest.requireActual('redux');
    const { dataReducer } = jest.requireActual('../modules/data/redux/reducer');
    return {
        __esModule: true,
        default: combineReducers({
            data: dataReducer,
            user: (state = {}) => state,
        }),
    };
});
jest.mock('./persistedState', () => ({ __esModule: true, default: {} }));

test('normalizes bootstrap details before consumers mount and keeps routing identities separate from project content', () => {
    const identity = {
        id: 1,
        shortname: 'portal',
        is_umbrella: true,
        archive_domain: null,
    };
    const store = archiveStore({
        user: { isLoggedIn: true },
        data: {
            users: { current: { id: 5 } },
            projects: {
                identities: { 1: identity },
                locale: 'de',
                data: [{ ...identity, name: 'Titel' }],
            },
        },
    });
    const state = store.getState();
    expect(state.data.projects.identities).toEqual({ 1: identity });
    expect(state.data.projects.resources).toEqual({});
    expect(state.data.projects).toMatchObject({
        context: projectAccessContext(state),
        records: { 1: identity },
        translations: { display: { 1: { de: { name: 'Titel' } } } },
        lists: {},
    });
    expect(Object.keys(state.data.projects.requests)).toHaveLength(2);
    expect(
        makeProjectDetailSelector()(
            state,
            projectDetailUrl('portal', 'de'),
            'de'
        )
    ).toMatchObject({
        project: { id: 1, name: 'Titel' },
        status: 'succeeded',
        isLoading: false,
    });
    expect(state.data.projects).not.toHaveProperty('data');
    expect(state.data.projects).not.toHaveProperty('locale');
});
