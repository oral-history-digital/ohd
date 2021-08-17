import { NAME } from './constants';

export const getFlyoutTabs = state => state[NAME];

export const getFlyoutTabsVisible = state => getFlyoutTabs(state).visible;

export const getFlyoutTabsIndex = state => getFlyoutTabs(state).index;
