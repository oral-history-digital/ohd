import sortByReferenceTypeOrder from './sortByReferenceTypeOrder';

test('sort references according to order of reference types', () => {
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
    const references = [
        {
            id: 1,
            label: 'birthplace',
            registry_reference_type_id: 1,
        },
        {
            id: 2,
            label: 'habitation',
            registry_reference_type_id: 3,
        },
    ];

    const actual = sortByReferenceTypeOrder(
        referenceTypes,
        'registry_reference_type_id',
        references
    );
    const expected = [
        {
            id: 2,
            label: 'habitation',
            registry_reference_type_id: 3,
        },
        {
            id: 1,
            label: 'birthplace',
            registry_reference_type_id: 1,
        },
    ];

    expect(actual).toEqual(expected);
});
