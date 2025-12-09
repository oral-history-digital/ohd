import { humanReadable } from './humanReadable';

describe('humanReadable', () => {
    // Test #1: Globalize translations_attributes pattern
    describe('Globalize translations_attributes', () => {
        test('should extract value from translations_attributes array', () => {
            const obj = {
                translations_attributes: [
                    { locale: 'de', name: 'Aufzeichnung' },
                    { locale: 'en', name: 'Recording' },
                ],
            };
            const actual = humanReadable({
                obj,
                attribute: 'name',
                locale: 'en',
                translations: {},
            });
            expect(actual).toEqual('Recording');
        });

        test('should extract value from translations_attributes object', () => {
            const obj = {
                translations_attributes: {
                    0: { locale: 'de', title: 'Titel' },
                    1: { locale: 'en', title: 'Title' },
                },
            };
            const actual = humanReadable({
                obj,
                attribute: 'title',
                locale: 'de',
                translations: {},
            });
            expect(actual).toEqual('Titel');
        });
    });

    // Test #2: Direct localized objects
    describe('Direct localized objects', () => {
        test('should return correct locale from localized object', () => {
            const obj = {
                group: { de: 'Dritte', en: 'Third Person' },
            };
            const actual = humanReadable({
                obj,
                attribute: 'group',
                locale: 'en',
                translations: {},
            });
            expect(actual).toEqual('Third Person');
        });

        test('should truncate long values when collapsed=true', () => {
            const longText = 'a'.repeat(600);
            const obj = {
                description: { de: longText, en: longText },
            };
            const actual = humanReadable({
                obj,
                attribute: 'description',
                locale: 'en',
                collapsed: true,
                translations: {},
            });
            expect(actual).toEqual(longText.substring(0, 500));
        });
    });

    // Test #3: Pass-through identifiers
    describe('Pass-through identifiers', () => {
        test('should return archive_id as-is', () => {
            const obj = { archive_id: 'za001' };
            const actual = humanReadable({
                obj,
                attribute: 'archive_id',
                locale: 'de',
                translations: { za001: { de: 'translated' } },
            });
            expect(actual).toEqual('za001');
        });

        test('should return signature_original as-is', () => {
            const obj = { signature_original: 'SIG-123' };
            const actual = humanReadable({
                obj,
                attribute: 'signature_original',
                locale: 'de',
                translations: {},
            });
            expect(actual).toEqual('SIG-123');
        });

        test('should return shortname as-is even when translations are available', () => {
            const obj = { shortname: 'bg' };
            const actual = humanReadable({
                obj,
                attribute: 'shortname',
                locale: 'de',
                translations: { bg: { de: 'bulgarisch' } },
            });
            expect(actual).toEqual('bg');
        });
    });

    // Test #4: Duration formatting
    describe('Duration formatting', () => {
        test('should format duration as hours and minutes', () => {
            const obj = { duration: '02:35:42' };
            const actual = humanReadable({
                obj,
                attribute: 'duration',
                locale: 'en',
                translations: {},
            });
            expect(actual).toEqual('02 h 35 min');
        });
    });

    // Test #5: Date formatting
    describe('Date formatting', () => {
        test('should format date values in ISO format', () => {
            const obj = { created_at: '2023-05-15' };
            const actual = humanReadable({
                obj,
                attribute: 'created_at',
                locale: 'en',
                translations: {},
            });
            // Should call toDateString - basic check that it returns a formatted string
            expect(actual).toBeTruthy();
            expect(typeof actual).toBe('string');
        });

        test('should not format invalid date strings', () => {
            const obj = { created_at: 'not-a-date' };
            const actual = humanReadable({
                obj,
                attribute: 'created_at',
                locale: 'en',
                translations: {},
            });
            // Should return the raw value if not a valid ISO date
            expect(actual).toEqual('not-a-date');
        });
    });

    // Test #6: Collection lookups
    describe('Collection lookups', () => {
        test('should lookup collection name by ID', () => {
            const obj = { collection_id: 123 };
            const collections = {
                123: { name: { de: 'Sammlung', en: 'Collection' } },
            };
            const actual = humanReadable({
                obj,
                attribute: 'collection_id',
                locale: 'en',
                collections,
                translations: {},
            });
            expect(actual).toEqual('Collection');
        });
    });

    // Test #7: Language lookups
    describe('Language lookups', () => {
        test('should lookup language name by interview_language_id', () => {
            const obj = { interview_language_id: 456 };
            const languages = {
                456: { name: { de: 'Deutsch', en: 'German' } },
            };
            const actual = humanReadable({
                obj,
                attribute: 'interview_language_id',
                locale: 'de',
                languages,
                translations: {},
            });
            expect(actual).toEqual('Deutsch');
        });

        test('should lookup language name by original_language_id', () => {
            const obj = { original_language_id: 789 };
            const languages = {
                789: { name: { de: 'Englisch', en: 'English' } },
            };
            const actual = humanReadable({
                obj,
                attribute: 'original_language_id',
                locale: 'en',
                languages,
                translations: {},
            });
            expect(actual).toEqual('English');
        });
    });

    // Test #8: Boolean translation
    describe('Boolean translation', () => {
        test('should translate true boolean', () => {
            const obj = { public: true };
            const translations = {
                'boolean_value.true': { de: 'ja', en: 'yes' },
            };
            const actual = humanReadable({
                obj,
                attribute: 'public',
                locale: 'en',
                translations,
            });
            expect(actual).toEqual('yes');
        });

        test('should translate false boolean', () => {
            const obj = { public: false };
            const translations = {
                'boolean_value.false': { de: 'nein', en: 'no' },
            };
            const actual = humanReadable({
                obj,
                attribute: 'public',
                locale: 'de',
                translations,
            });
            expect(actual).toEqual('nein');
        });
    });

    // Test #9: Array values
    describe('Array values', () => {
        test('should join array values with commas', () => {
            const obj = { tags: ['history', 'interview', 'archive'] };
            const actual = humanReadable({
                obj,
                attribute: 'tags',
                locale: 'en',
                translations: {},
            });
            expect(actual).toEqual('history,interview,archive');
        });
    });

    // Test #10: Nil/undefined handling
    describe('Nil/undefined handling', () => {
        test('should return default "---" for nil value', () => {
            const obj = { missing: null };
            const actual = humanReadable({
                obj,
                attribute: 'missing',
                locale: 'en',
                translations: {},
            });
            expect(actual).toEqual('---');
        });

        test('should return custom none value for undefined', () => {
            const obj = {};
            const actual = humanReadable({
                obj,
                attribute: 'missing',
                locale: 'en',
                none: 'N/A',
                translations: {},
            });
            expect(actual).toEqual('N/A');
        });
    });

    // Test #11: TranslationValue lookup (enum-like values)
    describe('TranslationValue lookup', () => {
        test('should lookup translation with optionsScope', () => {
            const obj = { gender: 'female' };
            const translations = {
                'registry_entry.gender.female': {
                    de: 'weiblich',
                    en: 'female',
                },
            };
            const actual = humanReadable({
                obj,
                attribute: 'gender',
                locale: 'de',
                optionsScope: 'registry_entry.gender',
                translations,
            });
            expect(actual).toEqual('weiblich');
        });

        test('should lookup translation without optionsScope', () => {
            const obj = { status: 'active' };
            const translations = {
                'status.active': { de: 'aktiv', en: 'active' },
            };
            const actual = humanReadable({
                obj,
                attribute: 'status',
                locale: 'de',
                translations,
            });
            expect(actual).toEqual('aktiv');
        });

        test('should fallback to direct value lookup', () => {
            const obj = { status: 'active' };
            const translations = {
                active: { de: 'aktiv', en: 'active' },
            };
            const actual = humanReadable({
                obj,
                attribute: 'status',
                locale: 'de',
                translations,
            });
            expect(actual).toEqual('aktiv');
        });

        test('should fallback to raw value if no translation found', () => {
            const obj = { status: 'unknown' };
            const actual = humanReadable({
                obj,
                attribute: 'status',
                locale: 'de',
                translations: {},
            });
            expect(actual).toEqual('unknown');
        });
    });
});
