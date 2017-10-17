import {
    SHOW_FLYOUT_TABS,
    HIDE_FLYOUT_TABS,
} from '../constants/archiveConstants';

const initialState = {
    visible: false,
    className: 'wrapper-flyout',
}

const flyoutTabs = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_FLYOUT_TABS:
            return Object.assign({}, action, {visible: true})
        case HIDE_FLYOUT_TABS:
            return Object.assign({}, state, {visible: false})

        default:
            return state;
    }
};

export default flyoutTabs;
