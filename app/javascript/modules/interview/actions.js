import { DISABLE_AUTO_SCROLL, ENABLE_AUTO_SCROLL } from './action-types';

export const enableAutoScroll = () => ({ type: ENABLE_AUTO_SCROLL });

export const disableAutoScroll = () => ({ type: DISABLE_AUTO_SCROLL });
