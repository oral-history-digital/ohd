import sortGroups from './sortGroups';

test('sort groups according to order of reference types', () => {
    const referenceGroups = [
        {
            id: 1,
            name: 'Czech Republic',
            references: [],
        },
        {
            id: 3,
            name: 'Berlin',
            references: [],
        },
    ];
    const referenceTypes = [
        {
            id: 3,
        },
        {
            id: 2,
        },
        {
            id: 1,
        },
    ];

    const actual = sortGroups(referenceTypes, referenceGroups);
    const expected = [
        {
            id: 3,
            name: 'Berlin',
            references: [],
        },
        {
            id: 1,
            name: 'Czech Republic',
            references: [],
        },
    ];

    expect(actual).toEqual(expected);
});
