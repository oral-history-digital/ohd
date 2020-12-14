import * as selectors from './locationsSelectors';

const state = {
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
            },
        ],
    },
};

test('getLocations retrieves locations object', () => {
    expect(selectors.getLocations(state)).toEqual(state.locations);
});
