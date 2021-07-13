import { Loader } from 'modules/api';

import {
    SET_QUERY_PARAMS,
    RESET_QUERY,

    REQUEST_ARCHIVE_SEARCH,
    RECEIVE_ARCHIVE_SEARCH,

    REQUEST_MAP_SEARCH,
    RECEIVE_MAP_SEARCH,
    REQUEST_MAP_REFERENCE_TYPES,
    RECEIVE_MAP_REFERENCE_TYPES,

    REQUEST_REGISTRY_ENTRY_SEARCH,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,

    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,
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

const requestArchiveSearch = (searchQuery) => ({
    type: REQUEST_ARCHIVE_SEARCH,
    searchQuery: searchQuery,
});

export const requestMapSearch = (searchQuery) => ({
    type: REQUEST_MAP_SEARCH,
    searchQuery: searchQuery,
});

export const requestMapReferenceTypes = () => ({ type: REQUEST_MAP_REFERENCE_TYPES });

function receiveArchiveSearchResults(json){
    return {
        type: RECEIVE_ARCHIVE_SEARCH,
        allInterviewsTitles: json.all_interviews_titles,
        allInterviewsPseudonyms: json.all_interviews_pseudonyms,
        allInterviewsPlacesOfBirth: json.all_interviews_birth_locations,
        allInterviewsCount: json.all_interviews_count,
        sortedArchiveIds: json.sorted_archive_ids,
        resultPagesCount: json.result_pages_count,
        resultsCount: json.results_count,
        foundInterviews: json.interviews,
        facets: json.facets,
        page: json.page,
        receivedAt: Date.now()
    }
}

export function receiveMapSearchResults(json){
    return {
        type: RECEIVE_MAP_SEARCH,
        payload: json,
    };
}

export const receiveMapReferenceTypes = (json) => ({
    type: RECEIVE_MAP_REFERENCE_TYPES,
    payload: json,
});

export function searchInArchive(url, searchQuery) {
    return dispatch => {
        dispatch(requestArchiveSearch(searchQuery))
        Loader.getJson(url, searchQuery, dispatch, receiveArchiveSearchResults);
    }
}

export function searchInMap(url, searchQuery) {
    return dispatch => {
        dispatch(requestMapSearch(searchQuery))
        //Loader.getJson(url, searchQuery, dispatch, receiveMapSearchResults);
    }
}

export const fetchMapReferenceTypes = url => dispatch => {
    dispatch(requestMapReferenceTypes());
    Loader.getJson(url, null, dispatch, receiveMapReferenceTypes);
};

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
