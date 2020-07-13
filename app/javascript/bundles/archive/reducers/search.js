import {
    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,

    REQUEST_REGISTRY_ENTRY_SEARCH,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,

    SET_QUERY_PARAMS,
    RESET_QUERY,

    REQUEST_ARCHIVE_SEARCH,
    RECEIVE_ARCHIVE_SEARCH,

    REQUEST_MAP_SEARCH,
    RECEIVE_MAP_SEARCH,
} from '../constants/archiveConstants';

const initialState = {
    archive: {
        facets: null,
        query:{},
        allInterviewsTitles: [],
        allInterviewsPseudonyms: [],
        allInterviewsPlacesOfBirth: [],
        foundInterviews: [],
        //foundSegmentsForInterviews: {},
        allInterviewsCount: 0,
        resultPagesCount: 1,
        resultsCount: 0,
        sortedArchiveIds: [],
    },
    map: {
        facets: null,
        query: {},
        foundMarkers: {},
    },
    interviews: {},
    registryEntries: {
        showRegistryEntriesTree: true,
        results: []
    },
    user_registrations: {
        query: {
            workflow_state: 'account_confirmed',
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
    console.log("---")
    console.log(state)
    console.log("---")
    switch (action.type) {
        case REQUEST_INTERVIEW_SEARCH:
            return Object.assign({}, state, {
                isInterviewSearching: true,
            })
        case RECEIVE_INTERVIEW_SEARCH:
            return Object.assign({}, state, {
                isInterviewSearching: false,
                interviews: Object.assign({}, state.interviews, {
                    [action.archiveId]: {
                        foundSegments: action.foundSegments,
                        foundPeople: action.foundPeople,
                        foundRegistryEntries: action.foundRegistryEntries,
                        foundBiographicalEntries: action.foundBiographicalEntries,
                        fulltext: action.fulltext
                    }
                })
            })
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
                    query: {},
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
            let foundInterviews = [];
            //let foundSegmentsForInterviews = {};
            if (action.page > 1){
                foundInterviews = state.archive.foundInterviews.concat(action.foundInterviews);
            }
            else {
                foundInterviews = action.foundInterviews;
            }
            return Object.assign({}, state, {
                archive: Object.assign({}, state.archive, {
                    facets: action.facets,
                    foundInterviews: foundInterviews,
                    allInterviewsTitles: action.allInterviewsTitles,
                    allInterviewsPseudonyms: action.allInterviewsPseudonyms,
                    allInterviewsPlacesOfBirth: action.allInterviewsPlacesOfBirth,
                    allInterviewsCount: action.allInterviewsCount,
                    resultPagesCount: action.resultPagesCount,
                    resultsCount: action.resultsCount,
                    sortedArchiveIds: action.sortedArchiveIds,
                }),
                isArchiveSearching: false,
            })
            case REQUEST_MAP_SEARCH:
            return Object.assign({}, state, {
                isMapSearching: true,
                map: Object.assign({}, state.map, {
                    query: Object.assign({}, state.map.query, action.searchQuery)
                })
            })
            case RECEIVE_MAP_SEARCH:
                return Object.assign({}, state, {
                    map: Object.assign({}, state.map, {
                        foundMarkers: action.foundMarkers
                    }),
                    isMapSearching: false,
                })

        default:
            return state;
    }
};

export default search;
