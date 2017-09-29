/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { REQUEST_LOCATIONS} from '../constants/archiveConstants';
import { RECEIVE_LOCATIONS} from '../constants/archiveConstants';

const requestLocations = (archiveId) => ({
  type: REQUEST_LOCATIONS,
  archiveId: archiveId,
});

function receiveLocations(json){
  return {
    type: RECEIVE_LOCATIONS,
    archiveId: json.archive_id,
    segmentRefLocations: json.segment_ref_locations,
    receivedAt: Date.now()
  }
}

export function fetchLocations(archiveId) {
  return dispatch => {
    dispatch(requestLocations(archiveId))
    Loader.getJson(`/de/locations?archive_id=${archiveId}`, null, dispatch, receiveLocations);
  }
}

