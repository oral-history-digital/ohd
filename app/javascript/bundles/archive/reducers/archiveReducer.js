import { combineReducers } from 'redux';

import { 
  REQUEST_INTERVIEW,
  RECEIVE_INTERVIEW,

  REQUEST_INTERVIEW_SEARCH,
  RECEIVE_INTERVIEW_SEARCH,

  REQUEST_ARCHIVE_SEARCH,
  RECEIVE_ARCHIVE_SEARCH,

  REQUEST_LOCATIONS,
  RECEIVE_LOCATIONS,

  VIDEO_TIME_CHANGE,
  VIDEO_ENDED,

  TRANSCRIPT_TIME_CHANGE,
  TRANSCRIPT_SCROLL,
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
  locale: 'de',
  archiveId: null,
  interviews: {},
  segments:[],
  facets: {},
  searchQuery:{},
  fulltext:"",
  foundInterviews: [],
  videoTime: 0,
  videoStatus: 'pause',
  transcriptTime: 0,
  isSearching: false,
  isFetchingInterview: false,
  isFetchingInterviewLocations: false,
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
              isFetching: true,
              didInvalidate: false
          })
      case RECEIVE_INTERVIEW_SEARCH:
          return Object.assign({}, state, {
              isSearching: false,
              didInvalidate: false,
              segments: action.segments
          })
    case REQUEST_ARCHIVE_SEARCH:
      return Object.assign({}, state, {
                isSearching: true,
              })
    case RECEIVE_ARCHIVE_SEARCH:
      return Object.assign({}, state, {
                isSearching: false,
                foundInterviews: action.foundInterviews,
                facets: action.facets,
                searchQuery: action.searchQuery,
                foundSegmentsForInterviews: action.foundSegmentsForInterviews,
                fulltext: action.fulltext,
              })
    case REQUEST_LOCATIONS:
      return Object.assign({}, state, {
                isFetchingInterviewLocations: true,
              })
    case RECEIVE_LOCATIONS:
      return Object.assign({}, state, {
                isFetchingInterviewLocations: false,
                interviews: Object.assign({}, state.interviews, {
                  [action.archiveId]: Object.assign({}, state.interviews[action.archiveId], {
                      segmentRefLocations: action.segmentRefLocations,
                      segmentRefLocationsLoaded: true
                  }),
                }),
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

    default:
      return state;
  }
};

const archiveReducer = combineReducers({ archive });

export default archiveReducer;
