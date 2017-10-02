/* eslint-disable import/prefer-default-export */

import { VIDEO_TIME_CHANGE } from '../constants/archiveConstants';
import { VIDEO_ENDED } from '../constants/archiveConstants';

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


