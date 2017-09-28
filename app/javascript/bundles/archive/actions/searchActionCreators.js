/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { REQUEST_ARCHIVE_SEARCH} from '../constants/archiveConstants';
import { RECEIVE_ARCHIVE_SEARCH} from '../constants/archiveConstants';

const requestArchiveSearch = (searchQuery) => ({
  type: REQUEST_ARCHIVE_SEARCH,
  searchQuery: searchQuery,
});

function receiveArchiveSearchResults(json){
  return {
    type: RECEIVE_ARCHIVE_SEARCH,
    foundInterviews: json.interviews,
    segmentsForInterviews: json.segments_for_interviews,
    facets: json.facets,
    searchQuery: json.session_query,
    fulltext: json.fulltext,
    receivedAt: Date.now()
  }
}

export function searchInArchive(url, searchQuery) {
  return dispatch => {
    dispatch(requestArchiveSearch(searchQuery))
    Loader.getJson(url, searchQuery, dispatch, receiveArchiveSearchResults);
  }
}

