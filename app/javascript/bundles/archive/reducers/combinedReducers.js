import { combineReducers } from 'redux';

import archive from './archive'
import data from './data'
import search from './search'
import popup from './popup'
import account from './account'

import { locationsReducer, LOCATIONS_NAME } from 'modules/locations';
import { flyoutTabsReducer, FLYOUT_TABS_NAME } from 'modules/flyout-tabs';
import { interviewReducer, INTERVIEW_NAME } from 'modules/interview';

const combinedReducer = combineReducers({
    archive,
    data,
    search,
    popup,
    account,
    [INTERVIEW_NAME]: interviewReducer,
    [LOCATIONS_NAME]: locationsReducer,
    [FLYOUT_TABS_NAME]: flyoutTabsReducer,
});

export default combinedReducer;
