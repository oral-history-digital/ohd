/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    SET_QUERY_PARAMS,
    RESET_QUERY,
    RECEIVE_FACETS,
    REQUEST_FACETS,

    REQUEST_ARCHIVE_SEARCH,
    RECEIVE_ARCHIVE_SEARCH,

    REQUEST_REGISTRY_ENTRY_SEARCH,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,

    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,
    INTERVIEW_SEARCH_URL,
    FACETS_URL,

    SET_USER_REGISTRATION_QUERY_PARAMS,
    RESET_USER_REGISTRATION_QUERY,
    REQUEST_USER_REGISTRATION_SEARCH,
    RECEIVE_USER_REGISTRATION_SEARCH,
} from '../constants/archiveConstants';

export function setQueryParams(params){
    return {
        type: SET_QUERY_PARAMS,
        params: params
    }
}

export function resetQuery(){
    return {
        type: RESET_QUERY,
    }
}

const requestFacets = () => ({
    type: REQUEST_FACETS,
});

function receiveFacets(json){
    return {
        type: RECEIVE_FACETS,
        facets: json.facets,
        receivedAt: Date.now()
    }
}

export function loadFacets() {
    return dispatch => {
        dispatch(requestFacets())
        Loader.getJson(FACETS_URL, null, dispatch, receiveFacets);
    }
}

const requestArchiveSearch = (searchQuery) => ({
    type: REQUEST_ARCHIVE_SEARCH,
    searchQuery: searchQuery,
});

function receiveArchiveSearchResults(json){
    return {
        type: RECEIVE_ARCHIVE_SEARCH,
        allInterviewsTitles: json.all_interviews_titles,
        allInterviewsPseudonyms: json.all_interviews_pseudonyms,
        allInterviewsPlacesOfBirth: json.all_interviews_places_of_birth,
        allInterviewsCount: json.all_interviews_count,
        resultPagesCount: json.result_pages_count,
        resultsCount: json.results_count,
        foundInterviews: json.interviews,
        facets: json.facets,
        receivedAt: Date.now()
    }
}

export function searchInArchive(url, searchQuery) {
    return dispatch => {
        dispatch(requestArchiveSearch(searchQuery))
        Loader.getJson(url, searchQuery, dispatch, receiveArchiveSearchResults);
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
        foundPeople: json.found_people,
        foundPhotos: json.found_photos,
        foundBiographicalEntries: json.found_biographical_entries,
        fulltext: json.fulltext,
        archiveId: json.archiveId,
        receivedAt: Date.now()
    }
}

export function searchInInterview(searchQuery) {
    return dispatch => {
        dispatch(requestInterviewSearch(searchQuery))
        Loader.getJson(INTERVIEW_SEARCH_URL, searchQuery, dispatch, receiveInterviewSearchResults);
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

export function setUserRegistrationQueryParams(params){
    return {
        type: SET_USER_REGISTRATION_QUERY_PARAMS,
        params: params
    }
}

export function resetUserRegistrationQuery(){
    return {
        type: RESET_USER_REGISTRATION_QUERY,
    }
}

const requestUserRegistrationSearch = (searchQuery) => ({
    type: REQUEST_USER_REGISTRATION_SEARCH,
});

function receiveUserRegistrationSearchResults(json){
    return {
        type: RECEIVE_USER_REGISTRATION_SEARCH,
        results: json.data,
        receivedAt: Date.now()
    }
}

export function searchUserRegistration(url, searchQuery) {
    return dispatch => {
        dispatch(requestUserRegistrationSearch(searchQuery))
        Loader.getJson(url, searchQuery, dispatch, receiveUserRegistrationSearchResults);
    }
}

