import {
    HIDE_SIDEBAR,
    SHOW_SIDEBAR,
    TOGGLE_SIDEBAR,
    SET_SIDEBAR_TABS_INDEX
} from './action-types';

export const showSidebar = () => ({
    type: SHOW_SIDEBAR,
});

export const hideSidebar = () => ({
    type: HIDE_SIDEBAR,
});

export const toggleSidebar = () => ({
    type: TOGGLE_SIDEBAR,
});

export const setSidebarTabsIndex = (index) => ({
    type: SET_SIDEBAR_TABS_INDEX,
    index,
});
