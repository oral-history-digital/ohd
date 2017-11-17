import {
    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,

    REQUEST_ARCHIVE_SEARCH,
    RECEIVE_ARCHIVE_SEARCH,
} from '../constants/archiveConstants';

const initialState = {
    facets: {},
    searchQuery:{},
    fulltext:"",
    foundInterviews: [],
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
                //interviews: Object.assign({}, state.interviews,
                    //Object.keys(action.foundSegmentsForInterviews).reduce(function(interviews, archiveId) {
                        //interviews[archiveId] = Object.assign({}, state.interviews[archiveId], {
                            //foundSegments: action.foundSegmentsForInterviews[archiveId],
                            //fulltext: action.fulltext
                        //});
                        //return interviews;
                    //}, {})
                //),
                facets: action.facets,
                searchQuery: action.searchQuery,
                fulltext: action.fulltext,
            })

        default:
            return state;
    }
};

export default search;
