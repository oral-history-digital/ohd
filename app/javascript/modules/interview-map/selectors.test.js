import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        isLoading: false,
        locations: [
            {
                id: 18220,
                lat: '52.21',
                lon: '21.03',
                name: 'Deutschland',
                ref_types: 'Segment',
            },
            {
                id: 18221,
                lat: '53.66',
                lon: '23.81',
                name: 'Berlin',
                ref_types: 'Segment,Segment,Segment',
            },
            {
                id: 18221,
                lat: '53.66',
                lon: '23.81',
                name: 'Berlin',
                ref_types: '4,14',
            },
        ],
        error: 'not found',
    },
};

test('getInterviewMap retrieves locations object', () => {
    expect(selectors.getInterviewMap(state)).toEqual(state[NAME]);
});

test('getInterviewMapLocations retrieves current locations', () => {
    expect(selectors.getInterviewMapLocations(state)).toEqual(state[NAME].locations);
});

test('getInterviewMapLoading retrieves loading state', () => {
    expect(selectors.getInterviewMapLoading(state)).toEqual(state[NAME].isLoading);
});

test('getInterviewMapError retrieves error message', () => {
    expect(selectors.getInterviewMapError(state)).toEqual(state[NAME].error);
});

test('getInterviewMapMarkers gets locations transformed into markers', () => {
    const actual = selectors.getInterviewMapMarkers(state);
    const expected = [
        {
            id: 18220,
            lat: 52.21,
            long: 21.03,
            name: 'Deutschland',
            numReferences: 1,
            radius: 7.5,
            color: 'red',
        },
        {
            id: 18221,
            lat: 53.66,
            long: 23.81,
            name: 'Berlin',
            numReferences: 5,
            radius: 7.5,
            color: 'red',
        },
    ];
    expect(actual).toEqual(expected);
});
