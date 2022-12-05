import { setDescriptor, findOrCreate } from './updateRegistryEntryAttributes';

test('finds an existing datum in attributes', () => {
    const attributes = [{a: 1, b: 2}, {a: 3}];

    expect(findOrCreate(attributes, 'a', 1)).toEqual({a: 1, b: 2});
});

test('creates an non existing datum in attributes', () => {
    const attributes = [{a: 1, b: 2}, {a: 3}];

    expect(findOrCreate(attributes, 'a', 2)).toEqual({a: 2});
    expect(attributes).toContainEqual({a: 2});
});

test('creates an non existing registryName in registryNamesAttributes and sets it s descriptor', () => {
    const registryNamesAttributes = [];
    setDescriptor('Istanbul', registryNamesAttributes, 3, 'de');

    expect(registryNamesAttributes).
        toContainEqual({
            registry_name_type_id: 3,
            name_position: 1,
            translations_attributes: [{
                descriptor: 'Istanbul',
                locale: 'de'
            }]
        });
});

test('creates an non existing translation in registryNamesAttributes and sets it s descriptor', () => {
    const registryNamesAttributes = [{
        registry_name_type_id: 3,
        name_position: 1,
        translations_attributes: [{
            descriptor: 'Breslau',
            locale: 'de'
        }]
    }];

    setDescriptor('Wrocław', registryNamesAttributes, 3, 'pl');

    expect(registryNamesAttributes[0].translations_attributes).
        toContainEqual({
            descriptor: 'Wrocław',
            locale: 'pl'
        });

    expect(registryNamesAttributes[0].translations_attributes).
        toContainEqual({
            descriptor: 'Breslau',
            locale: 'de'
        });
});

test('creates ancient name in registryNamesAttributes and sets it s descriptor', () => {
    const registryNamesAttributes = [{
        registry_name_type_id: 3,
        name_position: 1,
        translations_attributes: [{
            descriptor: 'Istanbul',
            locale: 'de'
        }]
    }];

    setDescriptor('Konstantinopel', registryNamesAttributes, 2, 'de');

    expect(registryNamesAttributes).
        toContainEqual({
            registry_name_type_id: 2,
            name_position: 1,
            translations_attributes: [
                {
                    descriptor: 'Konstantinopel',
                    locale: 'de'
                },
            ],
        });
});
