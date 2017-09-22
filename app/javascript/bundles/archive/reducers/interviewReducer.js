import { combineReducers } from 'redux';
import { LOAD_INTERVIEW } from '../constants/archiveConstants';

const interview = (state = '', action) => {
  switch (action.type) {
    case LOAD_INTERVIEW:
      return action.interview;
    default:
      return state;
  }
};

const interviewReducer = combineReducers({ interview });

export default interviewReducer;
