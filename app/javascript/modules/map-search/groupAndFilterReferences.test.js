import groupAndFilterReferences from './groupAndFilterReferences';

test('groups references by type and filters them', () => {
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

    const actual = groupAndFilterReferences(references, filter);
    const expected = {
        '1': [
            {
                id: 1,
                registry_reference_type_id: 1,
            },
            {
                id: 2,
                registry_reference_type_id: 1,
            },
        ],
        '2': [
            {
                id: 3,
                registry_reference_type_id: 2,
            },
        ],
    };

    expect(actual).toEqual(expected);
});
