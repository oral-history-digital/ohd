export { NAME as VIDEO_PLAYER_NAME } from './constants';

export { handleSegmentClick, handleTranscriptScroll, setActualSegment, setTapeAndTime,
    setInterviewTabIndex } from './actions';

export { default as videoPlayerReducer } from './reducer';

export { getCurrentTape, getTranscriptScrollEnabled, getTranscriptTime, getTabIndex } from './selectors';

export { default as VideoPlayerContainer } from './components/VideoPlayerContainer';
