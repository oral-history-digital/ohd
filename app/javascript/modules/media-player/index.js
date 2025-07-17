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
    MEDIA_PLAYER_HEIGHT_MOBILE,
    MEDIA_PLAYER_HEIGHT_SMALL,
    MEDIA_PLAYER_HEIGHT_MEDIUM,
    NAME as MEDIA_PLAYER_NAME,
} from './constants';

export * from './hooks';
export * from './utils';

export { default as MediaPlayer } from './components/MediaPlayer';
