/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
  REQUEST_INTERVIEW,
  RECEIVE_INTERVIEW,
  INTERVIEW_URL,
  TRANSCRIPT_TIME_CHANGE,
  TRANSCRIPT_SCROLL,
} from '../constants/archiveConstants';

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
    references: json.references,
    refTree: json.ref_tree,
    receivedAt: Date.now()
  }
}

export function fetchInterview(archiveId) {
  return dispatch => {
    dispatch(requestInterview(archiveId))
    Loader.getJson(`${INTERVIEW_URL}/${archiveId}`, null, dispatch, receiveInterview);
  }
}

export function handleSegmentClick(tape, time) {
  return {
      type: TRANSCRIPT_TIME_CHANGE,
      videoTime: time,
      tape: tape
  }
}

export function handleTranscriptScroll(bool) {
  return {
    type: TRANSCRIPT_SCROLL,
    transcriptScrollEnabled: bool,
  }
}
