import filterLocations from './filterLocations';

test('filters out locations with empty ref_types property', () => {
    const locations = [
        {
            id: 1,
            ref_types: '2,2,2',
        },
        {
            id: 2,
            ref_types: '',
        },
    ];

    const actual = filterLocations(locations);
    const expected = [
        {
            id: 1,
            ref_types: '2,2,2',
        },
    ];

    expect(actual).toEqual(expected);
});