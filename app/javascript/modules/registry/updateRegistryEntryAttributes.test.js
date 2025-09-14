import { setDescriptor, findOrCreate } from './updateRegistryEntryAttributes';

test('finds an existing datum in attributes', () => {
    const attributes = [{ a: 1, b: 2 }, { a: 3 }];

    expect(findOrCreate(attributes, 'a', 1)).toEqual(
        expect.objectContaining({
            a: 1,
            b: 2,
            creation_date: expect.any(String),
        })
    );
});

test('creates an non existing datum in attributes', () => {
    const attributes = [{ a: 1, b: 2 }, { a: 3 }];

    expect(findOrCreate(attributes, 'a', 2)).toEqual(
        expect.objectContaining({ a: 2, creation_date: expect.any(String) })
    );
    expect(attributes).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                a: 2,
                creation_date: expect.any(String),
            }),
        ])
    );
});

test('creates an non existing registryName in registryNamesAttributes and sets it s descriptor', () => {
    const registryNamesAttributes = [];
    setDescriptor('Istanbul', registryNamesAttributes, 3, 'de');

    expect(registryNamesAttributes).toContainEqual(
        expect.objectContaining({
            registry_name_type_id: 3,
            name_position: 1,
            creation_date: expect.any(String),
            translations_attributes: [
                expect.objectContaining({
                    descriptor: 'Istanbul',
                    locale: 'de',
                    creation_date: expect.any(String),
                }),
            ],
        })
    );
});

test('creates an non existing translation in registryNamesAttributes and sets it s descriptor', () => {
    const registryNamesAttributes = [
        {
            registry_name_type_id: 3,
            name_position: 1,
            translations_attributes: [
                {
                    descriptor: 'Breslau',
                    locale: 'de',
                },
            ],
        },
    ];

    setDescriptor('Wrocław', registryNamesAttributes, 3, 'pl');

    expect(registryNamesAttributes[0].translations_attributes).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                descriptor: 'Wrocław',
                locale: 'pl',
                creation_date: expect.any(String),
            }),
        ])
    );

    // existing translation may not have creation_date set by implementation
    expect(registryNamesAttributes[0].translations_attributes).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                descriptor: 'Breslau',
                locale: 'de',
            }),
        ])
    );
});

test('creates ancient name in registryNamesAttributes and sets it s descriptor', () => {
    const registryNamesAttributes = [
        {
            registry_name_type_id: 3,
            name_position: 1,
            translations_attributes: [
                {
                    descriptor: 'Istanbul',
                    locale: 'de',
                },
            ],
        },
    ];

    setDescriptor('Konstantinopel', registryNamesAttributes, 2, 'de');

    expect(registryNamesAttributes).toContainEqual(
        expect.objectContaining({
            registry_name_type_id: 2,
            name_position: 1,
            creation_date: expect.any(String),
            translations_attributes: [
                expect.objectContaining({
                    descriptor: 'Konstantinopel',
                    locale: 'de',
                    creation_date: expect.any(String),
                }),
            ],
        })
    );
});
