import { combineReducers } from 'redux';

import archive from './archive'
import popup from './popup'
import flyoutTabs from './flyoutTabs'
import userContent from './userContent'

const combinedReducer = combineReducers({ 
    archive,
    popup,
    flyoutTabs,
    userContent
});

export default combinedReducer;
