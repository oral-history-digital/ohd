/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { REQUEST_INTERVIEW} from '../constants/archiveConstants';
import { RECEIVE_INTERVIEW} from '../constants/archiveConstants';
import { INTERVIEW_URL} from '../constants/archiveConstants';
import { TRANSCRIPT_TIME_CHANGE } from '../constants/archiveConstants';
import { TRANSCRIPT_SCROLL } from '../constants/archiveConstants';

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

function receiveInterview(json){
  return {
    type: RECEIVE_INTERVIEW,
    archiveId: json.interview.archive_id,
    interview: json.interview,
    segments: json.segments,
    headings: json.headings,
    receivedAt: Date.now()
  }
}

export function fetchInterview(archiveId) {
  return dispatch => {
    dispatch(requestInterview(archiveId))
    Loader.getJson(`${INTERVIEW_URL}/${archiveId}`, null, dispatch, receiveInterview);
  }
}

export function handleSegmentClick(time) {
  return {
    type: TRANSCRIPT_TIME_CHANGE,
    videoTime: time,
  }
}

export function handleTranscriptScroll(bool) {
  return {
    type: TRANSCRIPT_SCROLL,
    transcriptScrollEnabled: bool,
  }
}

//function shouldFetchInterview(state, archiveId) {
  //const interview = state.interviewByArchiveId[archiveId]
  //if (!interview) {
    //return true
  //} else if (interview.isFetching) {
    //return false
  //} else {
    //return interview.didInvalidate
  //}
//}

//export function fetchInterviewIfNeeded(archiveId) {
  //debugger;
  //return (dispatch, getState) => {
  //debugger;
    ////if (shouldFetchInterview(getState(), archiveId)) {
      //return dispatch(fetchInterview(archiveId))
    ////}
  //}
//}
