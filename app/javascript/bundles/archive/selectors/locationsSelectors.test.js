import dotProp from 'dot-prop-immutable';

import * as selectors from './locationsSelectors';

const state = {
    archive: {
        archiveId: 'za283',
    },
    locations: {
        za283: [
            {
                id: 18220,
                type: 'RegistryReference',
                latitude: 52.21,
                longitude: 21.03,
            },
            {
                id: 18221,
                type: 'RegistryReference',
                latitude: 53.66,
                longitude: 23.81,
                ref_object: {
                    id: 15650,
                    type: 'Segment',
                    time: 33,
                },
            },
        ],
    },
};

test('getLocations retrieves locations object', () => {
    expect(selectors.getLocations(state)).toEqual(state.locations);
});

test('getCurrentLocations retrieves locations for archivId', () => {
    expect(selectors.getCurrentLocations(state)).toEqual(state.locations.za283);
});

describe('getCurrentLocationsWithRefs', () => {
    test('retrieves locations that have ref objects', () => {
        const actual = selectors.getCurrentLocationsWithRefs(state);
        const expected = [state.locations.za283[1]];
        expect(actual).toEqual(expected);
    });

    test('filters out locations without geodata', () => {
        const _state = dotProp.delete(state, 'locations.za283.1.latitude');
        const _state2 = dotProp.delete(_state, 'locations.za283.1.longitude');

        const actual = selectors.getCurrentLocationsWithRefs(_state2);
        const expected = [];
        expect(actual).toEqual(expected);
    });
})


test('getLocationsFetched retrieves if locations for archivId are present', () => {
    expect(selectors.getLocationsFetched(state)).toBeTruthy();
});
