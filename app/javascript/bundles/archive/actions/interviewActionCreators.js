/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    TRANSCRIPT_TIME_CHANGE,
    TRANSCRIPT_SCROLL,

    SET_TAPE_AND_TIME,
    SET_ACTUAL_SEGMENT
} from '../constants/archiveConstants';

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
