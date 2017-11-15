import { combineReducers } from 'redux';

import archive from './archive'
import popup from './popup'
import flyoutTabs from './flyoutTabs'
import userContent from './userContent'
import locations from './locations'
import account from './account'

const combinedReducer = combineReducers({ 
    archive,
    popup,
    flyoutTabs,
    userContent,
    locations,
    account
});

export default combinedReducer;
