/* eslint-disable import/prefer-default-export */

import { 
  VIDEO_TIME_CHANGE, 
  VIDEO_ENDED,
  SET_TAPE_AND_TIME,
  SET_NEXT_TAPE
} from '../constants/archiveConstants';

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

export function setTapeAndTime(tape, time) {
  return {
    type: SET_TAPE_AND_TIME,
    videoTime: time,
    transcriptTime: time,
    tape: tape
  }
}

export function setNextTape() {
  return {
    type: SET_NEXT_TAPE,
  }
}


