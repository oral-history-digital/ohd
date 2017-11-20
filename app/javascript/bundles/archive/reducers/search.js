import {
    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,

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
    //fulltext:"",
    foundInterviews: [],
    interviews: {},
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
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE_INTERVIEW_SEARCH:
            debugger;
            return Object.assign({}, state, {
                isInterviewSearching: false,
                didInvalidate: false,
                interviews: Object.assign({}, state.interviews, {
                    [action.archiveId]: Object.assign({}, state.interviews[action.archiveId], {
                        foundSegments: action.foundSegments,
                        fulltext: action.fulltext
                    })
                })
            })
        case SET_QUERY_PARAMS :
            return Object.assign({}, state, {
                query: Object.assign({}, state.query, {
                    [action.name]: action.value
                })
            })
        case RESET_QUERY:
            return Object.assign({}, state, {
                query: {},
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
        case REQUEST_ARCHIVE_SEARCH:
            return Object.assign({}, state, {
                isArchiveSearching: true,
            })
        case RECEIVE_ARCHIVE_SEARCH:
            return Object.assign({}, state, {
                isArchiveSearching: false,
                foundInterviews: action.foundInterviews,
                allInterviewsCount: action.allInterviewsCount,
                resultPagesCount: action.resultPagesCount,
                resultsCount: action.resultsCount,

                //facets: Object.assign({}, state.facets,
                    //Object.keys(action.facets).reduce(function(facets, archiveId) {
                        //facets[archiveId] = Object.assign({}, state.facets[archiveId], {
                            //foundSegments: action.foundSegmentsForInterviews[archiveId],
                            //fulltext: action.fulltext
                        //});
                        //return facets;
                    //}, {})
                //),
                facets: action.facets,
                //searchQuery: action.searchQuery,
                //fulltext: action.fulltext,
            })

        default:
            return state;
    }
};

export default search;
