/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
  REQUEST_ARCHIVE_SEARCH,
  RECEIVE_ARCHIVE_SEARCH,
  REQUEST_INTERVIEW_SEARCH,
  RECEIVE_INTERVIEW_SEARCH,
  INTERVIEW_SEARCH_URL,
  ARCHIVE_SEARCH_URL
} from '../constants/archiveConstants';

const requestArchiveSearch = (searchQuery) => ({
  type: REQUEST_ARCHIVE_SEARCH,
  searchQuery: searchQuery,
});

function receiveArchiveSearchResults(json){
  return {
    type: RECEIVE_ARCHIVE_SEARCH,
      allInterviewsCount: json.all_interviews_count,
      resultPagesCount: json.result_pages_count,
      resultsCount: json.results_count,
    foundInterviews: json.interviews,
    foundSegmentsForInterviews: json.found_segments_for_interviews,
    facets: json.facets,
    searchQuery: json.session_query,
    fulltext: json.fulltext,
    receivedAt: Date.now()
  }
}

export function searchInArchive(url, searchQuery) {
  return dispatch => {
    dispatch(requestArchiveSearch(searchQuery))
    Loader.getJson(ARCHIVE_SEARCH_URL, searchQuery, dispatch, receiveArchiveSearchResults);
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
        receivedAt: Date.now()
    }
}

export function searchInInterview(searchQuery) {
    return dispatch => {
        dispatch(requestInterviewSearch(searchQuery))
        Loader.getJson(INTERVIEW_SEARCH_URL, searchQuery, dispatch, receiveInterviewSearchResults);
    }
}
