import { combineReducers } from 'redux';

import { REQUEST_INTERVIEW } from '../constants/archiveConstants';
import { RECEIVE_INTERVIEW} from '../constants/archiveConstants';

const initialState = {
  interviews: {},
  archiveId: null,
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
      debugger;
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
    default:
      return state;
  }
};

const archiveReducer = combineReducers({ archive });

export default archiveReducer;
