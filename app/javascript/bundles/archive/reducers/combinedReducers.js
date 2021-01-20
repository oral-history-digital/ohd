import { combineReducers } from 'redux';

import archive from './archive'
import interview from './interview'
import data from './data'
import search from './search'
import popup from './popup'
import locations from './locations'
import account from './account'

import { flyoutTabsReducer, FLYOUT_TABS_NAME } from 'modules/flyout-tabs';

const combinedReducer = combineReducers({
    archive,
    interview,
    data,
    search,
    popup,
    locations,
    account,
    [FLYOUT_TABS_NAME]: flyoutTabsReducer,
});

export default combinedReducer;
