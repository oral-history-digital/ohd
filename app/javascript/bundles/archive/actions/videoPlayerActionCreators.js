/* eslint-disable import/prefer-default-export */

import { 
  VIDEO_TIME_CHANGE, 
  VIDEO_ENDED,
    SET_NEXT_TAPE
} from '../constants/archiveConstants';

export function handleVideoTimeChange(event) {
  return {
    type: VIDEO_TIME_CHANGE,
    transcriptTime: Math.round(event.target.currentTime*100)/100 
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


