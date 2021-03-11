import { TRANSCRIPT_SCROLL, SET_INTERVIEW_TAB_INDEX } from './action-types';

export const setInterviewTabIndex = (tabIndex) => ({
    type: SET_INTERVIEW_TAB_INDEX,
    tabIndex: tabIndex,
});

export const handleTranscriptScroll = (isEnabled) => ({
    type: TRANSCRIPT_SCROLL,
    transcriptScrollEnabled: isEnabled,
});
