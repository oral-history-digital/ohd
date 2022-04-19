import { Loader } from 'modules/api';

import {
    SET_QUERY_PARAMS,
    RESET_QUERY,
    REQUEST_REGISTRY_ENTRY_SEARCH,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,
    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,
    CLEAR_SINGLE_INTERVIEW_SEARCH,
    CLEAR_ALL_INTERVIEW_SEARCH,
} from './action-types';

export function setQueryParams(scope, params){
    return {
        type: SET_QUERY_PARAMS,
        scope: scope,
        params: params
    }
}

export function resetQuery(scope){
    return {
        type: RESET_QUERY,
        scope: scope,
    }
}

const requestInterviewSearch = (searchQuery) => ({
    type: REQUEST_INTERVIEW_SEARCH,
    searchQuery: searchQuery,
});

function receiveInterviewSearchResults(json){
    return {
        type: RECEIVE_INTERVIEW_SEARCH,
        foundSegments: json.found_segments,
        foundHeadings: json.found_headings,
        foundPhotos: json.found_photos,
        foundRegistryEntries: json.found_registry_entries,
        foundBiographicalEntries: json.found_biographical_entries,
        foundAnnotations: json.found_annotations,
        foundObservations: json.found_observations,
        fulltext: json.fulltext,
        archiveId: json.archiveId,
        receivedAt: Date.now()
    }
}

export function searchInInterview(url, searchQuery) {
    return dispatch => {
        dispatch(requestInterviewSearch(searchQuery))
        Loader.getJson(url, searchQuery, dispatch, receiveInterviewSearchResults);
    }
}

export const clearSingleInterviewSearch = archiveId => ({
    type: CLEAR_SINGLE_INTERVIEW_SEARCH,
    payload: archiveId,
});

export const clearAllInterviewSearch = () => ({
    type: CLEAR_ALL_INTERVIEW_SEARCH,
});

const requestRegistryEntrySearch = (searchQuery) => ({
    type: REQUEST_REGISTRY_ENTRY_SEARCH,
    searchQuery: searchQuery,
});

function receiveRegistryEntrySearchResults(json){
    return {
        type: RECEIVE_REGISTRY_ENTRY_SEARCH,
        registryEntries: json.registry_entries,
        fulltext: json.fulltext,
        receivedAt: Date.now()
    }
}

export function searchRegistryEntry(url, searchQuery) {
    return dispatch => {
        dispatch(requestRegistryEntrySearch(searchQuery))
        Loader.getJson(url, searchQuery, dispatch, receiveRegistryEntrySearchResults);
    }
}

export function changeRegistryEntriesViewMode(bool){
    return {
        type: CHANGE_REGISTRY_ENTRIES_VIEW_MODE,
        bool: bool
    }
}
