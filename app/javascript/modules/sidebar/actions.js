import { HIDE_SIDEBAR, SHOW_SIDEBAR, TOGGLE_SIDEBAR } from './action-types';

export const showSidebar = () => ({
    type: SHOW_SIDEBAR,
});

export const hideSidebar = () => ({
    type: HIDE_SIDEBAR,
});

export const toggleSidebar = () => ({
    type: TOGGLE_SIDEBAR,
});
