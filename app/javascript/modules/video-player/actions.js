import {
    TRANSCRIPT_TIME_CHANGE,
    TRANSCRIPT_SCROLL,
    SET_INTERVIEW_TAB_INDEX,
    SET_TAPE_AND_TIME,
    SET_ACTUAL_SEGMENT,
    VIDEO_TIME_CHANGE,
    VIDEO_ENDED,
    SET_TAPE_AND_TIME_AND_RESOLUTION,
    SET_NEXT_TAPE,
} from './action-types';

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
        transcriptTime: time,
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

export function handleVideoTimeChange(time) {
    return {
        type: VIDEO_TIME_CHANGE,
        transcriptTime: time
    }
  }

export function handleVideoEnded() {
    return {
        type: VIDEO_ENDED,
    }
}

export function setTapeAndTimeAndResolution(tape, time, resolution, videoStatus = 'pause') {
    return {
        type: SET_TAPE_AND_TIME_AND_RESOLUTION,
        videoTime: time,
        transcriptTime: time,
        tape,
        resolution,
        videoStatus,
    }
}

export function setNextTape() {
    return {
        type: SET_NEXT_TAPE,
    }
}
