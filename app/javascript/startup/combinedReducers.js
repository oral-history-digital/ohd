import { ARCHIVE_NAME, archiveReducer } from 'modules/archive';
import { BANNER_NAME, bannerReducer } from 'modules/banner';
import { DATA_NAME, dataReducer } from 'modules/data';
import { EDIT_TABLE_NAME, editTableReducer } from 'modules/edit-table';
import { FEATURES_NAME, featuresReducer } from 'modules/features';
import { INTERVIEW_NAME, interviewReducer } from 'modules/interview';
import { MEDIA_PLAYER_NAME, mediaPlayerReducer } from 'modules/media-player';
import { SEARCH_NAME, searchReducer } from 'modules/search';
import { SEARCH_MAP_NAME, searchMapReducer } from 'modules/search-map';
import { SIDEBAR_NAME, sidebarReducer } from 'modules/sidebar';
import { USER_NAME, userReducer } from 'modules/user';
import { combineReducers } from 'redux';

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
    [BANNER_NAME]: bannerReducer,
});

export default combinedReducer;
