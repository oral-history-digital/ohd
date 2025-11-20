import { Loader } from 'modules/api';

import {
    SET_QUERY_PARAMS,
    RESET_QUERY,
    REQUEST_REGISTRY_ENTRY_SEARCH,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,
} from './action-types';

export function setQueryParams(scope, params) {
    return {
        type: SET_QUERY_PARAMS,
        scope: scope,
        params: params,
    };
}

export function resetQuery(scope) {
    return {
        type: RESET_QUERY,
        scope: scope,
    };
}

const requestRegistryEntrySearch = (searchQuery) => ({
    type: REQUEST_REGISTRY_ENTRY_SEARCH,
    searchQuery: searchQuery,
});

function receiveRegistryEntrySearchResults(json) {
    return {
        type: RECEIVE_REGISTRY_ENTRY_SEARCH,
        registryEntries: json.registry_entries,
        project: json.project,
        fulltext: json.fulltext,
        receivedAt: Date.now(),
    };
}

export function searchRegistryEntry(url, searchQuery) {
    return (dispatch) => {
        dispatch(requestRegistryEntrySearch(searchQuery));
        Loader.getJson(
            url,
            searchQuery,
            dispatch,
            receiveRegistryEntrySearchResults
        );
    };
}

export function changeRegistryEntriesViewMode(bool, projectId) {
    return {
        type: CHANGE_REGISTRY_ENTRIES_VIEW_MODE,
        bool: bool,
        projectId: projectId,
    };
}
