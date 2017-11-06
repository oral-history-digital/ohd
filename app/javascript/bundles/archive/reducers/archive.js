import {
    REQUEST_INTERVIEW,
    RECEIVE_INTERVIEW,

    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,

    REQUEST_ARCHIVE_SEARCH,
    RECEIVE_ARCHIVE_SEARCH,

    VIDEO_TIME_CHANGE,
    VIDEO_ENDED,

    TRANSCRIPT_TIME_CHANGE,
    TRANSCRIPT_SCROLL,

    SET_LOCALE,
    REQUEST_STATIC_CONTENT,
    RECEIVE_STATIC_CONTENT,
} from '../constants/archiveConstants';

const initialState = {
    locale: 'de',
    locales: ['de', 'en', 'ru'],
    archiveId: null,
    interviews: {},

    facets: {},
    searchQuery:{},
    fulltext:"",
    foundInterviews: [],
    allInterviewsCount: 0,
    resultPagesCount: 1,
    resultsCount: 0,

    videoTime: 0,
    videoStatus: 'pause',
    transcriptTime: 0,
    transcriptScrollEnabled: false,

    isArchiveSearching: false,
    isInterviewSearching: false,
    isFetchingInterview: false,
    isFetchingInterviewLocations: false,

    homeContent: "",
    externalLinks: {}
}

const archive = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_INTERVIEW:
            return Object.assign({}, state, {
                isFetchingInterview: true,
                didInvalidate: false
            })
        case RECEIVE_INTERVIEW:
            return Object.assign({}, state, {
                isFetchingInterview: false,
                archiveId: action.archiveId,
                interviews: Object.assign({}, state.interviews, {
                    [action.archiveId]: Object.assign({}, state.interviews[action.archiveId], {
                        interview: action.interview,
                        segments: action.segments,
                        locations: action.locations,
                        headings: action.headings
                    }),
                }),
                lastUpdated: action.receivedAt
            })
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
        case VIDEO_TIME_CHANGE:
            return Object.assign({}, state, {
                transcriptTime: action.transcriptTime,
            })
        case VIDEO_ENDED:
            return Object.assign({}, state, {
                videoStatus: 'paused',
                videoTime: 0,
                transcriptTime: 0,
            })
        case TRANSCRIPT_TIME_CHANGE:
            return Object.assign({}, state, {
                videoTime: action.videoTime,
                transcriptScrollEnabled: false
            })
        case TRANSCRIPT_SCROLL:
            return Object.assign({}, state, {
                transcriptScrollEnabled: action.transcriptScrollEnabled
            })
        case SET_LOCALE:
            return Object.assign({}, state, {
                locale: action.locale
            })
        case REQUEST_STATIC_CONTENT:
            return Object.assign({}, state, {
                isFetchingExternalLinks: true
            })
        case RECEIVE_STATIC_CONTENT:
            return Object.assign({}, state, {
                isFetchingExternalLinks: false,
                externalLinks: action.externalLinks,
                homeContent: action.homeContent
            })

        default:
            return state;
    }
};

export default archive;
