import { combineReducers } from 'redux';

import { REQUEST_INTERVIEW } from '../constants/archiveConstants';
import { RECEIVE_INTERVIEW} from '../constants/archiveConstants';

import { REQUEST_ARCHIVE_SEARCH} from '../constants/archiveConstants';
import { RECEIVE_ARCHIVE_SEARCH} from '../constants/archiveConstants';

const initialState = {
  interviews: {},
  archiveId: null,
  facets: {},
  foundInterviews: [],
  searchQuery:{},
  fulltext:"",
  isFetching: false,
  didInvalidate: false
}

const archive = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_INTERVIEW:
      return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
              })
    case RECEIVE_INTERVIEW:
      return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                archiveId: action.archiveId,
                interviews: Object.assign({}, state.interviews, {
                  [action.archiveId]: {
                      interview: action.interview,
                      segments: action.segments,
                      headings: action.headings
                  }
                }),
                lastUpdated: action.receivedAt
              })
    case REQUEST_ARCHIVE_SEARCH:
      return Object.assign({}, state, {
                isSearching: true,
              })
    case RECEIVE_ARCHIVE_SEARCH:
      debugger;
      return Object.assign({}, state, {
                isSearching: false,
                foundInterviews: action.foundInterviews,
                facets: action.facets,
                searchQuery: action.searchQuery,
                fulltext: action.fulltext,
              })
    default:
      return state;
  }
};

const archiveReducer = combineReducers({ archive });

export default archiveReducer;
