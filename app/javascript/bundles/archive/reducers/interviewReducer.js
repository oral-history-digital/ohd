import { combineReducers } from 'redux';

import { REQUEST_INTERVIEW } from '../constants/archiveConstants';
import { RECEIVE_INTERVIEW} from '../constants/archiveConstants';

const initialState = {
  interview: null,
  interviews: [],
  archiveId: null,
  isFetching: false,
  didInvalidate: false
}

const interview = (state = initialState, action) => {
  debugger;
  switch (action.type) {
    //case REQUEST_INTERVIEW:
      //return action.interview;
    case REQUEST_INTERVIEW:
      return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
              })
    case RECEIVE_INTERVIEW:
      return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                interviews: [
                  ...state.interviews,
                  {
                    archiveId: action.archiveId,
                    interview: action.interview
                  }
                ],
                archiveId: action.archive_id,
                lastUpdated: action.receivedAt
              })
    default:
      return state;
  }
};

const interviewReducer = combineReducers({ interview });

export default interviewReducer;
