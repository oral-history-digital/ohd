/* eslint-disable import/prefer-default-export */
import Loader from '../../../lib/loader'

import {
    RECEIVE_REGISTER_CONTENT,
    REQUEST_REGISTER_CONTENT,
    REGISTER_NEW_URL
} from '../constants/archiveConstants';



const requestRegisterContent = () => ({
    type: REQUEST_REGISTER_CONTENT
});


function receiveRegsterContent(json){
    return {
        type: RECEIVE_REGISTER_CONTENT,
        registerContent: json.register_content,
        receivedAt: Date.now()
    }
}

export function fetchRegisterContent(archiveId) {
    return dispatch => {
        dispatch(requestRegisterContent())
        Loader.getJson(`${REGISTER_NEW_URL}`, null, dispatch, receiveRegsterContent);
    }
}