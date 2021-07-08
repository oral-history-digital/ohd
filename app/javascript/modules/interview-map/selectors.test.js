import dotProp from 'dot-prop-immutable';

import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    archive: {
        archiveId: 'za283',
    },
    [NAME]: {
        isLoading: false,
        error: 'not found',
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

test('getInterviewMap retrieves locations object', () => {
    expect(selectors.getInterviewMap(state)).toEqual(state[NAME]);
});

test('getCurrentLocations retrieves locations for archiveId', () => {
    expect(selectors.getCurrentLocations(state)).toEqual(state[NAME].za283);
});

describe('getCurrentLocationsWithRefs', () => {
    test('retrieves locations that have ref objects', () => {
        const actual = selectors.getCurrentLocationsWithRefs(state);
        const expected = [state[NAME].za283[1]];
        expect(actual).toEqual(expected);
    });

    test('filters out locations without geodata', () => {
        const _state = dotProp.delete(state, `${NAME}.za283.1.latitude`);
        const _state2 = dotProp.delete(_state, `${NAME}.za283.1.longitude`);

        const actual = selectors.getCurrentLocationsWithRefs(_state2);
        const expected = [];
        expect(actual).toEqual(expected);
    });
})


test('getInterviewMapFetched retrieves if locations for archiveId are present', () => {
    expect(selectors.getInterviewMapFetched(state)).toBeTruthy();
});

test('getInterviewMapLoading retrieves loading state', () => {
    expect(selectors.getInterviewMapLoading(state)).toEqual(state[NAME].isLoading);
});

test('getInterviewMapError retrieves error message', () => {
    expect(selectors.getInterviewMapError(state)).toEqual(state[NAME].error);
});
