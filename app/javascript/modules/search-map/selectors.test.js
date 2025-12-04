import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        filter: [1, 2, 3],
        mapView: [
            [51.50939, -0.11832],
            [44.433333, 26.1],
        ],
    },
};

test('getMapFilter retrieves search map filter', () => {
    expect(selectors.getMapFilter(state)).toEqual(state[NAME].filter);
});

test('getMapView retrieves current map view', () => {
    expect(selectors.getMapView(state)).toEqual(state[NAME].mapView);
});
