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
    allInterviewsTitles: [],
    allInterviewsPseudonyms: [],
    allInterviewsPlacesOfBirth: [],
    foundInterviews: [],
    foundSegmentsForInterviews: {},
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
            })
        case RECEIVE_INTERVIEW_SEARCH:
            return Object.assign({}, state, {
                isInterviewSearching: false,
                interviews: Object.assign({}, state.interviews, {
                    [action.archiveId]: Object.assign({}, state.interviews[action.archiveId], {
                        foundSegments: action.foundSegments,
                        fulltext: action.fulltext
                    })
                })
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
