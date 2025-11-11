export { sendTimeChangeRequest } from './redux/actions';
export { default as mediaPlayerReducer } from './redux/reducer';
export {
    getCurrentTape,
    getIsIdle,
    getIsPlaying,
    getMediaTime,
} from './redux/selectors';

export {
    DEFAULT_AUDIO_RESOLUTION,
    DEFAULT_VIDEO_RESOLUTION,
    NAME as MEDIA_PLAYER_NAME,
    SPACE_BEFORE_ACTIVE_ELEMENT,
} from './constants';

export * from './hooks';
export * from './utils';

export { default as MediaPlayer } from './components/MediaPlayer';
