/* eslint-disable import/prefer-default-export */

import { 
  VIDEO_TIME_CHANGE, 
  VIDEO_ENDED,
  SET_TAPE_AND_TIME_AND_RESOLUTION,
  SET_NEXT_TAPE,
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

export function setTapeAndTimeAndResolution(tape, time, resolution, videoStatus = 'pause') {
  return {
    type: SET_TAPE_AND_TIME_AND_RESOLUTION,
    videoTime: time,
    transcriptTime: time,
    tape: tape,
    resolution: resolution,
    videoStatus, videoStatus,
  }
}

export function setNextTape() {
  return {
    type: SET_NEXT_TAPE,
  }
}


