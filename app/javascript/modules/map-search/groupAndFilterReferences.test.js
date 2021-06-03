import groupAndFilterReferences from './groupAndFilterReferences';

test('filters references, groups them by type and sorts groups', () => {
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
        {
            id: 4,
            registry_reference_type_id: 3,
        },
        {
            id: 5,
            registry_reference_type_id: 3,
        },
    ];
    const filter = [1, 2];
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

    const actual = groupAndFilterReferences(references, filter, referenceTypes);
    const expected = [
        {
            id: 2,
            references: [
                {
                    id: 3,
                    registry_reference_type_id: 2,
                },
            ],
        },
        {
            id: 1,
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
    ];

    expect(actual).toEqual(expected);
});
