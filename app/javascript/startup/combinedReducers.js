import { combineReducers } from 'redux';

import { userReducer, USER_NAME } from 'modules/user';
import { archiveReducer, ARCHIVE_NAME } from 'modules/archive';
import { dataReducer, DATA_NAME } from 'modules/data';
import { editTableReducer, EDIT_TABLE_NAME } from 'modules/edit-table';
import { featuresReducer, FEATURES_NAME } from 'modules/features';
import { interviewReducer, INTERVIEW_NAME } from 'modules/interview';
import { mediaPlayerReducer, MEDIA_PLAYER_NAME } from 'modules/media-player';
import { searchMapReducer, SEARCH_MAP_NAME } from 'modules/search-map';
import { searchReducer, SEARCH_NAME } from 'modules/search';
import { sidebarReducer, SIDEBAR_NAME } from 'modules/sidebar';

const combinedReducer = combineReducers({
    [USER_NAME]: userReducer,
    [ARCHIVE_NAME]: archiveReducer,
    [DATA_NAME]: dataReducer,
    [EDIT_TABLE_NAME]: editTableReducer,
    [FEATURES_NAME]: featuresReducer,
    [INTERVIEW_NAME]: interviewReducer,
    [MEDIA_PLAYER_NAME]: mediaPlayerReducer,
    [SEARCH_MAP_NAME]: searchMapReducer,
    [SEARCH_NAME]: searchReducer,
    [SIDEBAR_NAME]: sidebarReducer,
});

export default combinedReducer;
