import filterReferences from './filterReferences';

test('filters references by reference type id', () => {
    const references = [
        {
            id: 1,
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
    ];
    const filter = [1, 2];

    const actual = filterReferences(filter, references);
    const expected = [
        {
            id: 1,
            registry_reference_type_id: 1,
        },
        {
            id: 3,
            registry_reference_type_id: 2,
        },
    ];

    expect(actual).toEqual(expected);
});
