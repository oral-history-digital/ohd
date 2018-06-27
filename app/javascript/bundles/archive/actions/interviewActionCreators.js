/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    REQUEST_INTERVIEW,
    RECEIVE_INTERVIEW,
    REQUEST_INTERVIEW_DATA,
    RECEIVE_INTERVIEW_DATA,
    INTERVIEW_URL,
    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    TRANSCRIPT_SCROLL,
    UPLOAD_TRANSCRIPT_URL,
    UPLOADED_TRANSCRIPT,
    CHANGE_TO_EDIT_VIEW
} from '../constants/archiveConstants';

const requestInterview = (archiveId) => ({
    type: REQUEST_INTERVIEW,
    archiveId: archiveId,
});

const requestInterviewData = (archiveId, dataType) => ({
    type: REQUEST_INTERVIEW_DATA,
    archiveId: archiveId,
    dataType: dataType
});

function receiveInterview(json){
    return {
        type: RECEIVE_INTERVIEW,
        archiveId: json.archive_id,
        interview: json,
        receivedAt: Date.now()
    }
}

const receiveInterviewData = (json) => ({
    type: RECEIVE_INTERVIEW_DATA,
    archiveId: json.archive_id,
    data: json.data,
    dataType: json.dataType,
    receivedAt: Date.now()
});

export function fetchInterview(archiveId) {
  return dispatch => {
    dispatch(requestInterview(archiveId))
    Loader.getJson(`${INTERVIEW_URL}/${archiveId}`, null, dispatch, receiveInterview);
  }
}

export function fetchInterviewData(archiveId, dataType) {
  return dispatch => {
    dispatch(requestInterviewData(archiveId, dataType))
    Loader.getJson(`${INTERVIEW_URL}/${archiveId}/${dataType}`, null, dispatch, receiveInterviewData);
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

export function changeToEditView(bool) {
    return {
        type: CHANGE_TO_EDIT_VIEW,
        editView: bool
    }
}

