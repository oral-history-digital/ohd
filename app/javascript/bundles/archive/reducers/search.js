import {
    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,

    REQUEST_REGISTRY_ENTRY_SEARCH,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,

    SET_USER_REGISTRATION_QUERY_PARAMS,
    RESET_USER_REGISTRATION_QUERY,
    REQUEST_USER_REGISTRATION_SEARCH,
    RECEIVE_USER_REGISTRATION_SEARCH,

    SET_QUERY_PARAMS,
    RESET_QUERY,
    RECEIVE_FACETS,
    REQUEST_FACETS,

    REQUEST_ARCHIVE_SEARCH,
    RECEIVE_ARCHIVE_SEARCH,
} from '../constants/archiveConstants';

const initialState = {
    facets: null,
    query:{},
    allInterviewsTitles: [],
    allInterviewsPseudonyms: [],
    allInterviewsPlacesOfBirth: [],
    foundInterviews: [],
    foundSegmentsForInterviews: {},
    interviews: {},
    registryEntries: {
        showRegistryEntriesTree: true,
        results: []
    },
    userRegistrations: {
        query: {
            workflow_state: 'unchecked',
            page: 1,
        },
        results: {
        },
        resultPagesCount: 1,
    },
    allInterviewsCount: 0,
    resultPagesCount: 1,
    resultsCount: 0,

    isArchiveSearching: false,
    isInterviewSearching: false,
}

const search = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_INTERVIEW_SEARCH:
            return Object.assign({}, state, {
                isInterviewSearching: true,
            })
        case RECEIVE_INTERVIEW_SEARCH:
            return Object.assign({}, state, {
                isInterviewSearching: false,
                interviews: Object.assign({}, state.interviews, {
                    [action.archiveId]: Object.assign({}, state.interviews[action.archiveId], {
                        foundSegments: action.foundSegments,
                        foundPeople: action.foundPeople,
                        foundPhotos: action.foundPhotos,
                        foundBiographicalEntries: action.foundBiographicalEntries,
                        fulltext: action.fulltext
                    })
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
                query: Object.assign({}, state.query, action.params)
            })
        case RESET_QUERY:
            return Object.assign({}, state, {
                query: {},
                interviews: {},
            })
        case SET_USER_REGISTRATION_QUERY_PARAMS :
            return Object.assign({}, state, {
                userRegistrations: Object.assign({}, state.userRegistrations, {
                    query: Object.assign({}, state.userRegistrations.query, action.params)
                })
            })
        case RESET_USER_REGISTRATION_QUERY:
            return Object.assign({}, state, {
                userRegistrations: Object.assign({}, state.userRegistrations, {
                    query: {workflow_state: 'unchecked'},
                }),
            })
        case REQUEST_USER_REGISTRATION_SEARCH:
            return Object.assign({}, state, {
                isUserRegistrationSearching: true,
            })
        case RECEIVE_USER_REGISTRATION_SEARCH:
            let results = {};
            if (action.page > 1){
                results = Object.assign({}, state.userRegistrations.results, action.results)
            }
            else {
                results = action.results;
            }

            return Object.assign({}, state, {
                isUserRegistrationSearching: false,
                userRegistrations: Object.assign({}, state.userRegistrations, {
                    results: results,
                    resultPagesCount: action.resultPagesCount,
                })
            })
        case REQUEST_FACETS:
            return Object.assign({}, state, {
                isFetchingFacets: true,
            })
        case RECEIVE_FACETS:
            return Object.assign({}, state, {
                isFetchingFacets: false,
                facets: action.facets,
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
                query: Object.assign({}, state.query, action.searchQuery)
            })
        case RECEIVE_ARCHIVE_SEARCH:
            let foundInterviews = [];
            let foundSegmentsForInterviews = {};
            if (state.query.page != undefined && state.query.page > 1){
                foundInterviews = state.foundInterviews.concat(action.foundInterviews);
            }
            else {
                foundInterviews = action.foundInterviews;
            }
            return Object.assign({}, state, {
                isArchiveSearching: false,
                foundInterviews: foundInterviews,
                allInterviewsTitles: action.allInterviewsTitles,
                allInterviewsPseudonyms: action.allInterviewsPseudonyms,
                allInterviewsPlacesOfBirth: action.allInterviewsPlacesOfBirth,
                allInterviewsCount: action.allInterviewsCount,
                resultPagesCount: action.resultPagesCount,
                resultsCount: action.resultsCount,
                facets: action.facets,
            })

        default:
            return state;
    }
};

export default search;
