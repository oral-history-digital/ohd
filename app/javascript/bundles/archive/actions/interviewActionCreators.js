/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    REQUEST_INTERVIEW,
    RECEIVE_INTERVIEW,
    INTERVIEW_URL,
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    TRANSCRIPT_SCROLL,
    UPLOAD_TRANSCRIPT_URL,
    UPLOADED_TRANSCRIPT
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
      doiContent: json.doi_content,
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

//const updateInterview = (params) => ({
    //type: UPDATE_INTERVIEW,
    //params: params,
//});

//const removeInterview = (id) => ({
    //type: REMOVE_INTERVIEW,
    //id: id,
//});

export function submitInterview(params) {
    if(params.id) {
        return dispatch => {
            //dispatch(updateInterview(params))
            Loader.put(`${INTERVIEW_URL}/${params.id}`, params, dispatch, null);
        }
    } else {
        return dispatch => {
            Loader.post(INTERVIEW_URL, params, dispatch, null);
            //Loader.post(INTERVIEW_URL, params, dispatch, receiveInterview);
        }
    }
}

const uploadedTranscript = (json) => ({
    type: UPLOADED_TRANSCRIPT,
    json: json
});

export function submitTranscript(params) {
    return dispatch => {
        Loader.post(UPLOAD_TRANSCRIPT_URL, params, dispatch, uploadedTranscript);
    }
}

export function handleSegmentClick(tape, time) {
    return {
        type: TRANSCRIPT_TIME_CHANGE,
        videoTime: time,
        tape: tape
    }
}

export function setTapeAndTime(tape, time) {
    return {
        type: SET_TAPE_AND_TIME,
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
