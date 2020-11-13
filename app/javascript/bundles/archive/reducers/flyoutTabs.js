import {
    SHOW_FLYOUT_TABS,
    HIDE_FLYOUT_TABS,
    TOGGLE_FLYOUT_TABS,
    SET_FLYOUT_TABS_INDEX
} from '../constants/archiveConstants';

import { INDEX_ACCOUNT } from '../constants/flyoutTabs';

const initialState = {
    visible: false,
    index: INDEX_ACCOUNT,
};

const flyoutTabs = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_FLYOUT_TABS:
            return {
                ...state,
                visible: true,
            };
        case HIDE_FLYOUT_TABS:
            return {
                ...state,
                visible: false,
            };
        case TOGGLE_FLYOUT_TABS:
            return {
                ...state,
                visible: !state.visible,
            };
        case SET_FLYOUT_TABS_INDEX:
            return {
                ...state,
                index: action.index,
            };
        default:
            return state;
    }
};

export default flyoutTabs;
