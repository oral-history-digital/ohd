export { sendTimeChangeRequest, setPlayerSize } from './redux/actions';
export { default as mediaPlayerReducer } from './redux/reducer';
export {
    getCurrentTape,
    getIsIdle,
    getIsPlaying,
    getMediaTime,
    getPlayerSize,
} from './redux/selectors';

export {
    DEFAULT_AUDIO_RESOLUTION,
    DEFAULT_PLAYER_SIZE,
    DEFAULT_VIDEO_RESOLUTION,
    MEDIA_PLAYER_HEIGHT_MEDIUM,
    MEDIA_PLAYER_HEIGHT_MOBILE,
    MEDIA_PLAYER_HEIGHT_SMALL,
    NAME as MEDIA_PLAYER_NAME,
    SPACE_BEFORE_ACTIVE_ELEMENT,
} from './constants';

export * from './hooks';
export * from './utils';

export { default as MediaPlayer } from './components/MediaPlayer';
