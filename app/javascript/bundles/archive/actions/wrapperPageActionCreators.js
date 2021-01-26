import { Loader } from 'modules/api';

import {
    RECEIVE_STATIC_CONTENT,
    REQUEST_STATIC_CONTENT,
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
        registryEntryMetadataFields: json.registry_entry_metadata_fields,
        registryReferenceTypeMetadataFields: json.registry_reference_type_metadata_fields,
        languages: json.languages,
        mediaStreams: json.media_streams,
        receivedAt: Date.now()
    }
}

export function fetchStaticContent(url) {
    return dispatch => {
        dispatch(requestStaticContent())
        Loader.getJson(url, null, dispatch, receiveStaticContent);
    }
}
