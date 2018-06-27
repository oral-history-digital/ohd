/* eslint-disable import/prefer-default-export */

import { 
  VIDEO_TIME_CHANGE, 
  VIDEO_ENDED,
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

export function setNextTape() {
  return {
    type: SET_NEXT_TAPE,
  }
}


