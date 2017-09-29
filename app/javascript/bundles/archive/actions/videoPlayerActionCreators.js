/* eslint-disable import/prefer-default-export */

import { VIDEO_TIME_CHANGE } from '../constants/archiveConstants';
import { VIDEO_ENDED } from '../constants/archiveConstants';

export function handleVideoTimeChange(event) {
  return {
    type: VIDEO_TIME_CHANGE,
    transcriptTime: event.target.currentTime,
  }
}

export function handleVideoEnded() {
  return {
    type: VIDEO_ENDED,
  }
}


