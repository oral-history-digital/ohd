import addLocationCount from './addLocationCount';

test('adds location count property to reference types', () => {
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
            ref_types: {1: 3},
        },
        {
            id: 3,
            ref_types: {1: 3},
        },

    ];
    const referenceTypes = [
        {
            id: 1,
            name: 'birthplace',
        },
        {
            id: 'segment',
            name: 'segment',
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
            id: 'segment',
            name: 'segment',
            locationCount: 1,
        },
    ];

    expect(actual).toEqual(expected);
});
