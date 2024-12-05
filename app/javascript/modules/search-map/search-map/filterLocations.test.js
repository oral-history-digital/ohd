import filterLocations from './filterLocations';

test('filters out locations with empty ref_types property', () => {
    const locations = [
        {
            id: 1,
            ref_types: {2: 3},
        },
        {
            id: 2,
            ref_types: {},
        },
    ];

    const actual = filterLocations(locations);
    const expected = [
        {
            id: 1,
            ref_types: {2: 3},
        },
    ];

    expect(actual).toEqual(expected);
});
