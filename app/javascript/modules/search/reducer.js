import {
    CLEAR_SEARCH,
    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,
    CLEAR_SINGLE_INTERVIEW_SEARCH,
    CLEAR_ALL_INTERVIEW_SEARCH,
    REQUEST_REGISTRY_ENTRY_SEARCH,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,
    SET_QUERY_PARAMS,
    RESET_QUERY,
    REQUEST_ARCHIVE_SEARCH,
    RECEIVE_ARCHIVE_SEARCH,
    SET_MAP_QUERY,
} from './action-types';

export const initialState = {
    archive: {
        facets: null,
        query:{page: 1},
        foundInterviews: null,
        resultPagesCount: 1,
        resultsCount: 0,
    },
    map: {
        facets: null,
        query: {},
    },
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
    case REQUEST_ARCHIVE_SEARCH:
        return Object.assign({}, state, {
            isArchiveSearching: true,
            archive: Object.assign({}, state.archive, {
                query: Object.assign({}, state.archive.query, action.searchQuery)
            })
        })
    case RECEIVE_ARCHIVE_SEARCH:
        let foundInterviews;
        if (parseInt(action.page) > 1){
            foundInterviews = state.archive.foundInterviews.concat(action.foundInterviews);
        }
        else {
            foundInterviews = action.foundInterviews;
        }
        return Object.assign({}, state, {
            archive: Object.assign({}, state.archive, {
                facets: action.facets,
                foundInterviews: foundInterviews,
                resultPagesCount: action.resultPagesCount,
                resultsCount: action.resultsCount,
            }),
            isArchiveSearching: false,
        })
    case SET_MAP_QUERY:
        return {
            ...state,
            map: {
                ...state.map,
                query: {
                    ...state.map.query,
                    ...action.payload,
                },
            },
        };
    case CLEAR_SEARCH:
        return Object.assign({}, state, {
            archive: Object.assign({}, state.archive, {
                facets: null,
                query: { page: 1 },
                foundInterviews: [],
                resultPagesCount: null,
                resultsCount: null,
            }),
            isArchiveSearching: false,
        })
    default:
        return state;
    }
};

export default search;
