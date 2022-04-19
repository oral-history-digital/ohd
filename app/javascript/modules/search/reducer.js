import {
    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,
    CLEAR_SINGLE_INTERVIEW_SEARCH,
    CLEAR_ALL_INTERVIEW_SEARCH,
    REQUEST_REGISTRY_ENTRY_SEARCH,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,
    SET_QUERY_PARAMS,
    RESET_QUERY,
} from './action-types';

export const initialState = {
    interviews: {},
    registryEntries: {
        showRegistryEntriesTree: true,
        results: []
    },
    user_registrations: {
        query: {
            'user_registration_projects.workflow_state': 'account_confirmed',
            page: 1,
        },
    },
    roles: { query: {page: 1} },
    permissions: { query: {page: 1} },
    people: { query: {page: 1} },
    projects: { query: {page: 1} },
    collections: { query: {page: 1} },
    languages: { query: {page: 1} },
}

const search = (state = initialState, action) => {
    let nextState;
    switch (action.type) {
    case REQUEST_INTERVIEW_SEARCH:
        return Object.assign({}, state, {
            isInterviewSearching: true,
        });
    case RECEIVE_INTERVIEW_SEARCH:
        return Object.assign({}, state, {
            isInterviewSearching: false,
            interviews: Object.assign({}, state.interviews, {
                [action.archiveId]: {
                    foundSegments: action.foundSegments,
                    foundHeadings: action.foundHeadings,
                    foundRegistryEntries: action.foundRegistryEntries,
                    foundBiographicalEntries: action.foundBiographicalEntries,
                    foundPhotos: action.foundPhotos,
                    foundAnnotations: action.foundAnnotations,
                    foundObservations: action.foundObservations,
                    fulltext: action.fulltext,
                }
            })
        });
    case CLEAR_SINGLE_INTERVIEW_SEARCH:
        nextState = {
            ...state,
            interviews: {
                ...state.interviews,
            },
        };
        delete nextState.interviews[action.payload];
        return nextState;
    case CLEAR_ALL_INTERVIEW_SEARCH:
        return {
            ...state,
            interviews: {},
        };
    case REQUEST_REGISTRY_ENTRY_SEARCH:
        return Object.assign({}, state, {
            isRegistryEntrySearching: true,
        })
    case RECEIVE_REGISTRY_ENTRY_SEARCH:
        return Object.assign({}, state, {
            isRegistryEntrySearching: false,
            registryEntries: {
                showRegistryEntriesTree: false,
                results: action.registryEntries
            }
        })
    case SET_QUERY_PARAMS :
        return Object.assign({}, state, {
            [action.scope]: Object.assign({}, state[action.scope], {
                query: Object.assign({}, state[action.scope].query, action.params)
            })
        })
    case RESET_QUERY:
        return Object.assign({}, state, {
            [action.scope]: Object.assign({}, state[action.scope], {
                query: {page: 1},
            }),
            'interviews': (action.scope === 'archive') ? {} : state['interviews'],
        })
    case CHANGE_REGISTRY_ENTRIES_VIEW_MODE:
        return Object.assign({}, state, {
            registryEntries: Object.assign({}, state.registryEntries, {
                showRegistryEntriesTree: action.bool
            })
        })
    default:
        return state;
    }
};

export default search;
