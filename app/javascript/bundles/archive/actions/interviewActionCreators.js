/* eslint-disable import/prefer-default-export */

import fetch from 'isomorphic-fetch'

import { REQUEST_INTERVIEW} from '../constants/archiveConstants';
import { RECEIVE_INTERVIEW} from '../constants/archiveConstants';

const requestInterview = (archiveId) => ({
  type: REQUEST_INTERVIEW,
  archiveId: archiveId,
});

//const receiveInterview = (archiveId, json) => ({
  //type: RECEIVE_INTERVIEW,
  //archiveId: archiveId,
  //interview: json.interview,
  //receivedAt: Date.now()
//});

function receiveInterview(archiveId, json){
  debugger;
  return {
    type: RECEIVE_INTERVIEW,
    archiveId: archiveId,
    interview: json.interview,
    receivedAt: Date.now()
  }
}

export function fetchInterview(archiveId) {
  debugger;
  return dispatch => {
    dispatch(requestInterview(archiveId))
    return fetch(`/de/interviews/${archiveId}/segments`, {
        //method: 'post',
        headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
        //body: JSON.stringify({a: 7, str: 'Some string: &=&'})
      })
      .then(response => response.json())
      .then(json => dispatch(receiveInterview(archiveId, json)))
  }
}

function shouldFetchInterview(state, archiveId) {
  const interview = state.interviewByArchiveId[archiveId]
  if (!interview) {
    return true
  } else if (interview.isFetching) {
    return false
  } else {
    return interview.didInvalidate
  }
}

export function fetchInterviewIfNeeded(archiveId) {
  debugger;
  return (dispatch, getState) => {
  debugger;
    //if (shouldFetchInterview(getState(), archiveId)) {
      return dispatch(fetchInterview(archiveId))
    //}
  }
}
