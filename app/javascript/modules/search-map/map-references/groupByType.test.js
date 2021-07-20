import groupByType from './groupByType';

test('groups references by reference type', () => {
    const references = [
        {
            id: 1,
            registry_reference_type_id: 1,
        },
        {
            id: 2,
            registry_reference_type_id: 1,
        },
        {
            id: 3,
            registry_reference_type_id: 2,
        },
    ];
    const referenceTypes = [
        {
            id: 1,
            name: 'Czech Republic',
        },
        {
            id: 2,
            name: 'Poland',
        },
        {
            id: 3,
            name: 'Berlin',
        },
    ];

    const actual = groupByType(referenceTypes, references);
    const expected = [
        {
            id: 1,
            name: 'Czech Republic',
            references: [
                {
                    id: 1,
                    registry_reference_type_id: 1,
                },
                {
                    id: 2,
                    registry_reference_type_id: 1,
                },
            ],
        },
        {
            id: 2,
            name: 'Poland',
            references: [
                {
                    id: 3,
                    registry_reference_type_id: 2,
                },
            ],
        },
    ];

    expect(actual).toEqual(expected);
});
