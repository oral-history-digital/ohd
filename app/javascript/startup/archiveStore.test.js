import { projectAccessContext } from '../modules/data/redux/projectRequests';
import archiveStore from './archiveStore';

jest.mock('modules/api', () => ({
    apiMiddleware: () => (next) => (action) => next(action),
}));
jest.mock('modules/data', () => ({
    initializeProjectSummaries: jest.requireActual(
        '../modules/data/redux/actions'
    ).initializeProjectSummaries,
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

test('normalizes bootstrap summaries before consumers mount and keeps routing identities separate from project content', () => {
    const identity = {
        id: 1,
        shortname: 'portal',
        is_umbrella: true,
        archive_domain: null,
    };
    const store = archiveStore({
        user: { isLoggedIn: true },
        data: { users: { current: { id: 5 } } },
        projectSummaries: {
            identities: { 1: identity },
            locale: 'de',
            data: [{ ...identity, name: 'Titel' }],
        },
    });
    const state = store.getState();
    expect(state.data.projects.identities).toEqual({ 1: identity });
    expect(state.data.projects.resources).toEqual({});
    expect(state.data.projects).toMatchObject({
        context: projectAccessContext(state),
        records: { 1: identity },
        translations: { display: { 1: { de: { name: 'Titel' } } } },
        requests: {},
        lists: {},
    });
    expect(state).not.toHaveProperty('projectSummaries');
});
