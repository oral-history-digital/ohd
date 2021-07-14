import addLocationCount from './addLocationCount';

test('adds location count property to reference types', () => {
    const locations = [
        {
            id: 1,
            ref_types: '1,1,1,2,2,2',
        },
        {
            id: 2,
            ref_types: '1,1,1',
        },
        {
            id: 3,
            ref_types: '1,1,1'
        }

    ];
    const referenceTypes = [
        {
            id: 1,
            name: 'birthplace',
        },
        {
            id: 2,
            name: 'habitation',
        },
    ];

    const actual = addLocationCount(locations, referenceTypes);
    const expected = [
        {
            id: 1,
            name: 'birthplace',
            locationCount: 3,
        },
        {
            id: 2,
            name: 'habitation',
            locationCount: 1,
        },
    ];

    expect(actual).toEqual(expected);
});
