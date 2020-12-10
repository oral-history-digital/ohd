export const getFlyoutTabs = state => state.flyoutTabs;

export const getFlyoutTabsVisible = state => getFlyoutTabs(state).visible;

export const getFlyoutTabsIndex = state => getFlyoutTabs(state).index;
