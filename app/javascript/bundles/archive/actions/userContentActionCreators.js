/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    //POST_USER_CONTENT,
    //PUT_USER_CONTENT,
    RECEIVE_USER_CONTENT,
    UPDATE_USER_CONTENT,
    ADD_USER_CONTENT,
    REMOVE_USER_CONTENT,
    USER_CONTENT_URL,

    REQUEST_USER_CONTENTS,
    RECEIVE_USER_CONTENTS,
    //USERCONTENTS_URL,
} from '../constants/archiveConstants';

//const postUserContent = (params) => ({
    //type: POST_USER_CONTENT,
    //params: params,
//});

//const putUserContent = (params) => ({
    //type: PUT_USER_CONTENT,
    //params: params,
//});

const addUserContent = (params) => ({
    type: ADD_USER_CONTENT,
    params: params,
});

const updateUserContent = (params) => ({
    type: UPDATE_USER_CONTENT,
    params: params,
});

const removeUserContent = (id) => ({
    type: REMOVE_USER_CONTENT,
    id: id,
});

function receiveNewUserContent(json){
    return {
        type: RECEIVE_USER_CONTENT,
        userContent: json
    }
}

export function submitUserContent(params) {
    if(params.id) {
        return dispatch => {
            dispatch(updateUserContent(params))
            Loader.put(`${USER_CONTENT_URL}/${params.id}.json`, params, dispatch, null);
        }
    } else {
        return dispatch => {
            //dispatch(postUserContent(params))
            //
            //dispatch(addUserContent(params))
            //Loader.post(USER_CONTENT_URL, params, dispatch, null);
            Loader.post(`${USER_CONTENT_URL}.json`, params, dispatch, receiveNewUserContent);
        }
    }
}

export function deleteUserContent(id) {
    return dispatch => {
        dispatch(removeUserContent(id))
        Loader.delete(`${USER_CONTENT_URL}/${id}.json`, dispatch, null);
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
        Loader.getJson(`${USER_CONTENT_URL}.json`, null, dispatch, receiveUserContents);
    }
}

