import addFilterInformation from './addFilterInformation';

test('adds property to reference types whether they are filtered', () => {
    const filter = [1];
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

    const actual = addFilterInformation(filter, referenceTypes);
    const expected = [
        {
            id: 1,
            name: 'birthplace',
            filterIsSet: true,
        },
        {
            id: 2,
            name: 'habitation',
            filterIsSet: false,
        },
    ];

    expect(actual).toEqual(expected);
});
