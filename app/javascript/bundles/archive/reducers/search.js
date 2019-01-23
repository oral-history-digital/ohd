import {
    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,

    REQUEST_REGISTRY_ENTRY_SEARCH,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,

    SET_QUERY_PARAMS,
    RESET_QUERY,
    RECEIVE_FACETS,
    REQUEST_FACETS,

    REQUEST_ARCHIVE_SEARCH,
    RECEIVE_ARCHIVE_SEARCH,
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
    },
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
    },
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
                    [action.archiveId]: {
                        foundSegments: action.foundSegments,
                        foundPeople: action.foundPeople,
                        foundPhotos: action.foundPhotos,
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
                    foundInterviews: foundInterviews,
                    allInterviewsTitles: action.allInterviewsTitles,
                    allInterviewsPseudonyms: action.allInterviewsPseudonyms,
                    allInterviewsPlacesOfBirth: action.allInterviewsPlacesOfBirth,
                    allInterviewsCount: action.allInterviewsCount,
                    resultPagesCount: action.resultPagesCount,
                    resultsCount: action.resultsCount,
                    facets: action.facets,
                }),
                isArchiveSearching: false,
            })

        default:
            return state;
    }
};

export default search;
