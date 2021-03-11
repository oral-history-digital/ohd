export { NAME as MEDIA_PLAYER_NAME } from './constants';

export { handleSegmentClick, setTapeAndTime } from './actions';

export { default as mediaPlayerReducer } from './reducer';

export { getCurrentTape, getTranscriptTime } from './selectors';

export { default as MediaPlayerContainer } from './components/MediaPlayerContainer';
