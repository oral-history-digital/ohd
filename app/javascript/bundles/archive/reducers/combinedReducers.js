import { combineReducers } from 'redux';

import data from './data';
import { archiveReducer, ARCHIVE_NAME } from 'modules/archive';
import { locationsReducer, LOCATIONS_NAME } from 'modules/locations';
import { flyoutTabsReducer, FLYOUT_TABS_NAME } from 'modules/flyout-tabs';
import { interviewReducer, INTERVIEW_NAME } from 'modules/interview';
import { accountReducer, ACCOUNT_NAME } from 'modules/account';
import { popupReducer, POPUP_NAME } from 'modules/ui';
import { searchReducer, SEARCH_NAME } from 'modules/search';

const combinedReducer = combineReducers({
    data,
    [ARCHIVE_NAME]: archiveReducer,
    [SEARCH_NAME]: searchReducer,
    [POPUP_NAME]: popupReducer,
    [ACCOUNT_NAME]: accountReducer,
    [INTERVIEW_NAME]: interviewReducer,
    [LOCATIONS_NAME]: locationsReducer,
    [FLYOUT_TABS_NAME]: flyoutTabsReducer,
});

export default combinedReducer;
