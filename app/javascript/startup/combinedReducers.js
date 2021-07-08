import { combineReducers } from 'redux';

import { accountReducer, ACCOUNT_NAME } from 'modules/account';
import { archiveReducer, ARCHIVE_NAME } from 'modules/archive';
import { dataReducer, DATA_NAME } from 'modules/data';
import { featuresReducer, FEATURES_NAME } from 'modules/features';
import { flyoutTabsReducer, FLYOUT_TABS_NAME } from 'modules/flyout-tabs';
import { interviewMapReducer, INTERVIEW_MAP_NAME } from 'modules/interview-map';
import { interviewReducer, INTERVIEW_NAME } from 'modules/interview';
import { mediaPlayerReducer, MEDIA_PLAYER_NAME } from 'modules/media-player';
import { popupReducer, POPUP_NAME } from 'modules/ui';
import { searchReducer, SEARCH_NAME } from 'modules/search';
import { treeSelectReducer, TREE_SELECT_NAME } from 'modules/tree-select';

const combinedReducer = combineReducers({
    [ACCOUNT_NAME]: accountReducer,
    [ARCHIVE_NAME]: archiveReducer,
    [DATA_NAME]: dataReducer,
    [FEATURES_NAME]: featuresReducer,
    [FLYOUT_TABS_NAME]: flyoutTabsReducer,
    [INTERVIEW_MAP_NAME]: interviewMapReducer,
    [INTERVIEW_NAME]: interviewReducer,
    [MEDIA_PLAYER_NAME]: mediaPlayerReducer,
    [POPUP_NAME]: popupReducer,
    [SEARCH_NAME]: searchReducer,
    [TREE_SELECT_NAME]: treeSelectReducer,
});

export default combinedReducer;
