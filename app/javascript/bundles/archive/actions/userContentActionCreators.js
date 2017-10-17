/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    POST_USER_CONTENT,
    RECEIVE_USER_CONTENT,
    USER_CONTENT_URL,

    REQUEST_USER_CONTENTS,
    RECEIVE_USER_CONTENTS,
    //USERCONTENTS_URL,
} from '../constants/archiveConstants';

const postUserContent = (params) => ({
    type: POST_USER_CONTENT,
    params: params,
});

function receiveNewUserContent(json){
    return {
        type: RECEIVE_USER_CONTENT,
        userContent: json
    }
}

export function submitUserContent(params) {
    return dispatch => {
        dispatch(postUserContent(params))
        Loader.post(USER_CONTENT_URL, params, dispatch, receiveNewUserContent);
    }
}

const requestUserContents = () => ({
    type: REQUEST_USER_CONTENTS,
});

function receiveUserContents(json){
    return {
        type: RECEIVE_USER_CONTENTS,
        userContents: json,
        receivedAt: Date.now()
    }
}

export function fetchUserContents() {
    return dispatch => {
        dispatch(requestUserContents())
        Loader.getJson(USER_CONTENT_URL, null, dispatch, receiveUserContents);
    }
}

