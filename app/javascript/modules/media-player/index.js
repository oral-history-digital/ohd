export { NAME as MEDIA_PLAYER_NAME } from './constants';

export { sendTimeChangeRequest, setPlayerSize } from './actions';

export { default as mediaPlayerReducer } from './reducer';

export { getCurrentTape, getMediaTime, getIsPlaying, getIsIdle, getPlayerSize } from './selectors';

export { default as MediaPlayer } from './components/MediaPlayer';
