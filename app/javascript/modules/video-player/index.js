export { NAME as VIDEO_PLAYER_NAME } from './constants';

export { handleSegmentClick, setTapeAndTime } from './actions';

export { default as videoPlayerReducer } from './reducer';

export { getCurrentTape, getTranscriptTime } from './selectors';

export { default as VideoPlayerContainer } from './components/VideoPlayerContainer';
