import { v2AccessContext } from '../modules/data/redux/v2Requests';
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

test('normalizes bootstrap summaries before consumers mount and retains only routing identities in legacy storage', () => {
    const identity = {
        id: 1,
        shortname: 'portal',
        is_umbrella: true,
        archive_domain: null,
    };
    const store = archiveStore({
        user: { isLoggedIn: true },
        data: { projects: { 1: identity }, users: { current: { id: 5 } } },
        projectSummaries: {
            locale: 'de',
            data: [{ ...identity, name: 'Titel' }],
        },
    });
    const state = store.getState();
    expect(state.data.projects).toEqual({ 1: identity });
    expect(state.data.v2.projects).toMatchObject({
        context: v2AccessContext(state),
        records: { 1: identity },
        translations: { display: { 1: { de: { name: 'Titel' } } } },
        requests: {},
        lists: {},
    });
    expect(state).not.toHaveProperty('projectSummaries');
});
