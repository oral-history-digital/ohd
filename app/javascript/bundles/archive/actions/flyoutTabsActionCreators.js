import {
    HIDE_FLYOUT_TABS,
    SHOW_FLYOUT_TABS,
    TOGGLE_FLYOUT_TABS
} from '../constants/archiveConstants';

export const showFlyoutTabs = (params={}) => {
    params['type'] = SHOW_FLYOUT_TABS;
    return params;
};

export const hideFlyoutTabs = () => ({
    type: HIDE_FLYOUT_TABS,
});

// future work
export const toggleFlyoutTabs = () => ({
    type: TOGGLE_FLYOUT_TABS,
});


