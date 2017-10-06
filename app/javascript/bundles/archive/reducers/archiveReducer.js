import { combineReducers } from 'redux';

import { 
  REQUEST_INTERVIEW,
  RECEIVE_INTERVIEW,

  REQUEST_INTERVIEW_SEARCH,
  RECEIVE_INTERVIEW_SEARCH,

  REQUEST_ARCHIVE_SEARCH,
  RECEIVE_ARCHIVE_SEARCH,

  //REQUEST_LOCATIONS,
  //RECEIVE_LOCATIONS,

  VIDEO_TIME_CHANGE,
  VIDEO_ENDED,

  TRANSCRIPT_TIME_CHANGE,
  TRANSCRIPT_SCROLL,

  SET_LOCALE
} from '../constants/archiveConstants';

//function interviewData(interviews, action){
  //return {
    //Object.assign({}, interviews, {
      //[action.archiveId]: {
        //interview: action.interview,
        //segments: action.segments,
        //headings: action.headings
      //}
    //})
  //}
//}

const initialState = {
  locale: 'en',
  locales: ['de', 'en', 'ru'],
  archiveId: null,
  interviews: {},
  segments:[],
  facets: {},
  searchQuery:{},
  fulltext:"",
  foundInterviews: [],
    foundSegmentsForInterviews: [],
    foundSegments:[],
  videoTime: 0,
  videoStatus: 'pause',
  transcriptTime: 0,
  transcriptScrollEnabled: false,
  isArchiveSearching: false,
    isInterviewSearching: false,
  isFetchingInterview: false,
  isFetchingInterviewLocations: false,
    interviewFulltext:""
}

const archive = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_INTERVIEW:
      return Object.assign({}, state, {
                isFetchingInterview: true,
                didInvalidate: false
              })
    case RECEIVE_INTERVIEW:
        // when loading the interview set foundSegments to to generalFoundSegments
        let segementsFound = state.foundSegmentsForInterviews[action.archiveId] !== undefined && state.foundSegmentsForInterviews[action.archiveId].length > 0;
        let foundSegments = segementsFound ? state.foundSegmentsForInterviews[action.archiveId] : [];
        let interviewFulltext = segementsFound ? state.fulltext : '';


        return Object.assign({}, state, {
                isFetchingInterview: false,
                foundSegments: foundSegments,
            interviewFulltext: interviewFulltext,
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
              foundSegments: action.foundSegments
          })
    case REQUEST_ARCHIVE_SEARCH:
      return Object.assign({}, state, {
                isArchiveSearching: true,
              })
    case RECEIVE_ARCHIVE_SEARCH:
      return Object.assign({}, state, {
                isArchiveSearching: false,
                foundInterviews: action.foundInterviews,
                facets: action.facets,
                searchQuery: action.searchQuery,
                foundSegmentsForInterviews: action.foundSegmentsForInterviews,
                fulltext: action.fulltext,
              })
    //case REQUEST_LOCATIONS:
      //return Object.assign({}, state, {
                //isFetchingInterviewLocations: true,
              //})
    //case RECEIVE_LOCATIONS:
      //return Object.assign({}, state, {
                //isFetchingInterviewLocations: false,
                //interviews: Object.assign({}, state.interviews, {
                  //[action.archiveId]: Object.assign({}, state.interviews[action.archiveId], {
                      //segmentRefLocations: action.segmentRefLocations,
                      //segmentRefLocationsLoaded: true
                  //}),
                //}),
              //})
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
      $("body").removeClass("fix-video");
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

    default:
      return state;
  }
};

const archiveReducer = combineReducers({ archive });

export default archiveReducer;
