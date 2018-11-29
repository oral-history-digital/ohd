/* eslint-disable import/prefer-default-export */

import request from 'superagent';

import { 
    TRANSCRIPT_TIME_CHANGE,
    TRANSCRIPT_SCROLL,
    SET_INTERVIEW_TAB_INDEX,

    SET_TAPE_AND_TIME,
    SET_ACTUAL_SEGMENT,

    //EXPORT_DOI,
    RECEIVE_MSG
} from '../constants/archiveConstants';

export function handleSegmentClick(tape, time, tabIndex) {
    return {
        type: TRANSCRIPT_TIME_CHANGE,
        videoTime: time,
        tape: tape,
        tabIndex: tabIndex,
    }
}

export function setTapeAndTime(tape, time) {
    return {
        type: SET_TAPE_AND_TIME,
        videoTime: time,
        tape: tape
    }
}

export function setInterviewTabIndex(tabIndex) {
    return {
        tabIndex: tabIndex,
        type: SET_INTERVIEW_TAB_INDEX,
    }
}

export function setActualSegment(segment) {
    return {
        type: SET_ACTUAL_SEGMENT,
        segment: segment
    }
}

export function handleTranscriptScroll(bool) {
  return {
    type: TRANSCRIPT_SCROLL,
    transcriptScrollEnabled: bool,
  }
}

const receiveMsg = (json) => ({
    type: RECEIVE_MSG,
    id: json.archive_id || json.id,
    msg: json.msg
});

export function submitDois(archiveIds, locale='de') {
    return dispatch => {
        request
            .post('/de/interviews/dois')
            .send({ archive_ids: archiveIds })
            .set('Accept', 'application/json')
            .then(res => {
                if (res) {
                    dispatch(receiveMsg(JSON.parse(res.text)));
                }
            });
    }
}
