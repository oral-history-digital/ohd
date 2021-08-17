import { combineReducers } from 'redux';

import { accountReducer, ACCOUNT_NAME } from 'modules/account';
import { archiveReducer, ARCHIVE_NAME } from 'modules/archive';
import { dataReducer, DATA_NAME } from 'modules/data';
import { featuresReducer, FEATURES_NAME } from 'modules/features';
import { flyoutTabsReducer, FLYOUT_TABS_NAME } from 'modules/flyout-tabs';
import { interviewReducer, INTERVIEW_NAME } from 'modules/interview';
import { mediaPlayerReducer, MEDIA_PLAYER_NAME } from 'modules/media-player';
import { popupReducer, POPUP_NAME } from 'modules/ui';
import { searchMapReducer, SEARCH_MAP_NAME } from 'modules/search-map';
import { searchReducer, SEARCH_NAME } from 'modules/search';
import { treeSelectReducer, TREE_SELECT_NAME } from 'modules/tree-select';
import { workbookReducer, WORKBOOK_NAME } from 'modules/workbook';

const combinedReducer = combineReducers({
    [ACCOUNT_NAME]: accountReducer,
    [ARCHIVE_NAME]: archiveReducer,
    [DATA_NAME]: dataReducer,
    [FEATURES_NAME]: featuresReducer,
    [FLYOUT_TABS_NAME]: flyoutTabsReducer,
    [INTERVIEW_NAME]: interviewReducer,
    [MEDIA_PLAYER_NAME]: mediaPlayerReducer,
    [POPUP_NAME]: popupReducer,
    [SEARCH_MAP_NAME]: searchMapReducer,
    [SEARCH_NAME]: searchReducer,
    [TREE_SELECT_NAME]: treeSelectReducer,
    [WORKBOOK_NAME]: workbookReducer,
});

export default combinedReducer;
