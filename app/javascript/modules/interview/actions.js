import { ENABLE_AUTO_SCROLL, DISABLE_AUTO_SCROLL, SET_INTERVIEW_TAB_INDEX } from './action-types';

export const setInterviewTabIndex = (tabIndex) => ({
    type: SET_INTERVIEW_TAB_INDEX,
    tabIndex: tabIndex,
});

export const enableAutoScroll = () => ({ type: ENABLE_AUTO_SCROLL });

export const disableAutoScroll = () => ({ type: DISABLE_AUTO_SCROLL });
