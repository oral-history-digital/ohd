import filterReferenceTypes from './filterReferenceTypes';

test('filters ref_types property of each location according to filters set', () => {
    const filter = [2];
    const locations = [
        {
            id: 1,
            ref_types: '1,1,1,2,2,2',
        },
        {
            id: 2,
            ref_types: '1,1,1',
        },
    ];

    const actual = filterReferenceTypes(filter, locations);
    const expected = [
        {
            id: 1,
            ref_types: '2,2,2',
        },
        {
            id: 2,
            ref_types: '',
        },
    ];

    expect(actual).toEqual(expected);
});
