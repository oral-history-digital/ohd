import filterReferenceTypes from './filterReferenceTypes';

test('filters ref_types property of each location according to filters set', () => {
    const filter = ['segment'];
    const locations = [
        {
            id: 1,
            ref_types: {
                1: 3,
                segment: 3,
            },
        },
        {
            id: 2,
            ref_types: { 1: 3 },
        },
    ];

    const actual = filterReferenceTypes(filter, locations);
    const expected = [
        {
            id: 1,
            ref_types: { segment: 3 },
        },
        {
            id: 2,
            ref_types: {},
        },
    ];

    expect(actual).toEqual(expected);
});
