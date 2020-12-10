const getInterview = state => state.interview;

export const getCurrentTape = state => getInterview(state).tape;

export const getVideoTime = state => getInterview(state).videoTime;

export const getVideoStatus = state => getInterview(state).videoStatus;

export const getTranscriptTime = state => getInterview(state).transcriptTime;

export const getTranscriptScrollEnabled = state => getInterview(state).transcriptScrollEnabled;

export const getVideoResolution = state => getInterview(state).resolution;
