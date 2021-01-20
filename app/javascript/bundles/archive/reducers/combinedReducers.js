import { combineReducers } from 'redux';

import archive from './archive'
import interview from './interview'
import data from './data'
import search from './search'
import popup from './popup'
import account from './account'

import { locationsReducer, LOCATIONS_NAME } from 'modules/locations';
import { flyoutTabsReducer, FLYOUT_TABS_NAME } from 'modules/flyout-tabs';

const combinedReducer = combineReducers({
    archive,
    interview,
    data,
    search,
    popup,
    account,
    [LOCATIONS_NAME]: locationsReducer,
    [FLYOUT_TABS_NAME]: flyoutTabsReducer,
});

export default combinedReducer;
