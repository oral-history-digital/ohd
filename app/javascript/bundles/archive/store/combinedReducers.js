import { combineReducers } from 'redux';

import { accountReducer, ACCOUNT_NAME } from 'modules/account';
import { archiveReducer, ARCHIVE_NAME } from 'modules/archive';
import { dataReducer, DATA_NAME } from 'modules/data';
import { flyoutTabsReducer, FLYOUT_TABS_NAME } from 'modules/flyout-tabs';
import { locationsReducer, LOCATIONS_NAME } from 'modules/locations';
import { popupReducer, POPUP_NAME } from 'modules/ui';
import { searchReducer, SEARCH_NAME } from 'modules/search';
import { videoPlayerReducer, VIDEO_PLAYER_NAME } from 'modules/video-player';

const combinedReducer = combineReducers({
    [ACCOUNT_NAME]: accountReducer,
    [ARCHIVE_NAME]: archiveReducer,
    [DATA_NAME]: dataReducer,
    [FLYOUT_TABS_NAME]: flyoutTabsReducer,
    [LOCATIONS_NAME]: locationsReducer,
    [POPUP_NAME]: popupReducer,
    [SEARCH_NAME]: searchReducer,
    [VIDEO_PLAYER_NAME]: videoPlayerReducer,
});

export default combinedReducer;
