import { combineReducers } from 'redux';

import archive from './archive';
import data from './data';
import search from './search';

import { locationsReducer, LOCATIONS_NAME } from 'modules/locations';
import { flyoutTabsReducer, FLYOUT_TABS_NAME } from 'modules/flyout-tabs';
import { interviewReducer, INTERVIEW_NAME } from 'modules/interview';
import { accountReducer, ACCOUNT_NAME } from 'modules/account';
import { popupReducer, POPUP_NAME } from 'modules/ui';

const combinedReducer = combineReducers({
    archive,
    data,
    search,
    [POPUP_NAME]: popupReducer,
    [ACCOUNT_NAME]: accountReducer,
    [INTERVIEW_NAME]: interviewReducer,
    [LOCATIONS_NAME]: locationsReducer,
    [FLYOUT_TABS_NAME]: flyoutTabsReducer,
});

export default combinedReducer;
