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
        externalLinks: json.external_links,
        homeContent: json.home_content,
        translations: json.translations,
        country_keys: json.country_keys,
        collections: json.collections,
        languages: json.languages,
        locales: json.locales,
        project: json.project,
        projectDoi: json.project_doi,
        projectName: json.project_name,
        projectDomain: json.project_domain,
        archiveDomain: json.archive_domain,
        receivedAt: Date.now()
    }
}

export function fetchStaticContent(archiveId) {
    return dispatch => {
        dispatch(requestStaticContent())
        Loader.getJson(`${HOME_CONTENT_URL}`, null, dispatch, receiveStaticContent);
    }
}


