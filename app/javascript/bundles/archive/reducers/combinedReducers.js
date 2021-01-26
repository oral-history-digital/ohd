import { combineReducers } from 'redux';

import archive from './archive'
import data from './data'
import search from './search'
import popup from './popup'

import { locationsReducer, LOCATIONS_NAME } from 'modules/locations';
import { flyoutTabsReducer, FLYOUT_TABS_NAME } from 'modules/flyout-tabs';
import { interviewReducer, INTERVIEW_NAME } from 'modules/interview';
import { accountReducer, ACCOUNT_NAME } from 'modules/account';

const combinedReducer = combineReducers({
    archive,
    data,
    search,
    popup,
    [ACCOUNT_NAME]: accountReducer,
    [INTERVIEW_NAME]: interviewReducer,
    [LOCATIONS_NAME]: locationsReducer,
    [FLYOUT_TABS_NAME]: flyoutTabsReducer,
});

export default combinedReducer;
