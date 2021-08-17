import {
    HIDE_FLYOUT_TABS,
    SHOW_FLYOUT_TABS,
    TOGGLE_FLYOUT_TABS,
    SET_FLYOUT_TABS_INDEX
} from './action-types';

export const showFlyoutTabs = () => ({
    type: SHOW_FLYOUT_TABS,
});

export const hideFlyoutTabs = () => ({
    type: HIDE_FLYOUT_TABS,
});

export const toggleFlyoutTabs = () => ({
    type: TOGGLE_FLYOUT_TABS,
});

export const setFlyoutTabsIndex = (index) => ({
    type: SET_FLYOUT_TABS_INDEX,
    index,
});
