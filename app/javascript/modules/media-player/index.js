export {
    DEFAULT_AUDIO_RESOLUTION,
    DEFAULT_PLAYER_SIZE,
    DEFAULT_VIDEO_RESOLUTION,
    MEDIA_PLAYER_HEIGHT_MOBILE,
    MEDIA_PLAYER_HEIGHT_SMALL,
    MEDIA_PLAYER_HEIGHT_MEDIUM,
    NAME as MEDIA_PLAYER_NAME,
} from './constants';

export { sendTimeChangeRequest, setPlayerSize } from './actions';

export { default as mediaPlayerReducer } from './reducer';

export {
    getCurrentTape,
    getIsIdle,
    getIsPlaying,
    getMediaTime,
    getPlayerSize,
} from './selectors';

export { default as MediaPlayer } from './components/MediaPlayer';
