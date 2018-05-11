/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    SET_QUERY_PARAMS,
    RESET_QUERY,
    RECEIVE_FACETS,
    REQUEST_FACETS,
    REQUEST_ARCHIVE_SEARCH,
    RECEIVE_ARCHIVE_SEARCH,
    REQUEST_INTERVIEW_SEARCH,
    RECEIVE_INTERVIEW_SEARCH,
    INTERVIEW_SEARCH_URL,
    FACETS_URL,
} from '../constants/archiveConstants';

export function setQueryParams(params){
    return {
        type: SET_QUERY_PARAMS ,
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
        //allInterviewsTitles: json.all_interviews_titles,
        allInterviewsCount: json.all_interviews_count,
        resultPagesCount: json.result_pages_count,
        resultsCount: json.results_count,
        foundInterviews: json.interviews,
        foundSegmentsForInterviews: json.found_segments_for_interviews,
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
