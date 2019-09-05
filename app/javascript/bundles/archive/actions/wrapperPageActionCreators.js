/* eslint-disable import/prefer-default-export */
import Loader from '../../../lib/loader'

import {
    RECEIVE_STATIC_CONTENT,
    REQUEST_STATIC_CONTENT,
    HOME_CONTENT_URL
} from '../constants/archiveConstants';

const requestStaticContent = () => ({
    type: REQUEST_STATIC_CONTENT
});


function receiveStaticContent(json){
    return {
        type: RECEIVE_STATIC_CONTENT,
        homeContent: json.home_content,
        translations: json.translations,
        countryKeys: json.country_keys,
        collections: json.collections,
        contributionTypes: json.contribution_types,
        rootRegistryEntry: json.root_registry_entry,
        languages: json.languages,
        mediaStreams: json.media_streams,
        receivedAt: Date.now()
    }
}

export function fetchStaticContent(archiveId) {
    return dispatch => {
        dispatch(requestStaticContent())
        Loader.getJson(`${HOME_CONTENT_URL}`, null, dispatch, receiveStaticContent);
    }
}


