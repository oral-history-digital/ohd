import { combineReducers } from 'redux';

import archive from './archive'
import popup from './popup'
import userContent from './userContent'

const combinedReducer = combineReducers({ 
    archive,
    popup,
    userContent
});

export default combinedReducer;
