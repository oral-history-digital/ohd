/* eslint-disable import/prefer-default-export */

import fetch from 'isomorphic-fetch'

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
    facets: json.facets,
    searchQuery: json.session_query,
    fulltext: json.fulltext,
    receivedAt: Date.now()
  }
}

export function searchInArchive(url, searchQuery) {
  return dispatch => {
    dispatch(requestArchiveSearch(searchQuery))
    return fetch(`${url}?${searchQuery}`, {
        headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
      })
      .then(response => response.json())
      .then(json => dispatch(receiveArchiveSearchResults(json)))
  }
}

