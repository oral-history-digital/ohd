import { combineReducers } from 'redux';

import archive from './archive'
import interview from './interview'
import data from './data'
import search from './search'
import popup from './popup'
import flyoutTabs from './flyoutTabs'
import userContent from './userContent'
import locations from './locations'
import account from './account'

const combinedReducer = combineReducers({ 
    archive,
    interview,
    data,
    search,
    popup,
    flyoutTabs,
    userContent,
    locations,
    account,
});

export default combinedReducer;
