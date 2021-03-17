import request from 'superagent';
import { normalize, schema } from 'normalizr';

import { REQUEST_LOCATIONS, RECEIVE_LOCATIONS } from './action-types';

const segment = new schema.Entity('segments');

const registryReference = new schema.Entity('registryReferences', {
    ref_object: segment,
});

const registryReferenceList = new schema.Array(registryReference);


const requestLocations = (archiveId) => ({
    type: REQUEST_LOCATIONS,
    archiveId: archiveId,
});

const receiveLocations = (archiveId, normalizedData) => ({
    type: RECEIVE_LOCATIONS,
    payload: {
        archiveId,
        ...normalizedData,
    },
});

export const fetchLocations = (url, archiveId) => async dispatch => {
    dispatch(requestLocations(archiveId));

    let res;
    res = await request.get(url)
        .query({ 'archive_id': archiveId })
        .set('Accept', 'application/json');

    const originalData = res.body;

    const normalizedData = normalize(originalData.segment_ref_locations, registryReferenceList);

    dispatch(receiveLocations(originalData.archive_id, normalizedData));
}
