export { NAME as MEDIA_PLAYER_NAME } from './constants';

export { sendTimeChangeRequest } from './actions';

export { default as mediaPlayerReducer } from './reducer';

export { getCurrentTape, getMediaTime, getIsPlaying, getSticky } from './selectors';

export { default as MediaPlayerContainer } from './components/MediaPlayerContainer';
