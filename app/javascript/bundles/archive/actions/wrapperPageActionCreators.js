/* eslint-disable import/prefer-default-export */
import Loader from '../../../lib/loader'

import {
    SET_LOCALE,
    RECEIVE_STATIC_CONTENT,
    REQUEST_STATIC_CONTENT,
    HOME_CONTENT_URL
} from '../constants/archiveConstants';

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    locale: locale,
});

const requestStaticContent = () => ({
    type: REQUEST_STATIC_CONTENT
});


function receiveStaticContent(json){
    return {
        type: RECEIVE_STATIC_CONTENT,
        externalLinks: json.external_links,
        homeContent: json.home_content,
        receivedAt: Date.now()
    }
}

export function fetchStaticContent(archiveId) {
    return dispatch => {
        dispatch(requestStaticContent())
        Loader.getJson(`${HOME_CONTENT_URL}`, null, dispatch, receiveStaticContent);
    }
}


