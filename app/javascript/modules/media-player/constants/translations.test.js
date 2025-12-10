import langAr from 'video.js/dist/lang/ar.json';
import langDe from 'video.js/dist/lang/de.json';
import langEl from 'video.js/dist/lang/el.json';
import langEn from 'video.js/dist/lang/en.json';
import langEs from 'video.js/dist/lang/es.json';
import langRu from 'video.js/dist/lang/ru.json';
import langUk from 'video.js/dist/lang/uk.json';

import { VIDEOJS_I18N_KEY_MAP } from './translations';

// Test multiple language files to ensure our mapping covers all scenarios
const LANGUAGE_FILES = [
    { code: 'ar', data: langAr, name: 'Arabic' },
    { code: 'de', data: langDe, name: 'German' },
    { code: 'el', data: langEl, name: 'Greek' },
    { code: 'en', data: langEn, name: 'English' },
    { code: 'es', data: langEs, name: 'Spanish' },
    { code: 'ru', data: langRu, name: 'Russian' },
    { code: 'uk', data: langUk, name: 'Ukranian' },
];

describe('Video.js Translation Mapping', () => {
    describe('VIDEOJS_I18N_KEY_MAP completeness', () => {
        LANGUAGE_FILES.forEach(({ code, data, name }) => {
            test(`should cover all keys from Video.js ${name} (${code}) language file`, () => {
                const videoJsKeys = Object.keys(data);
                const mappedKeys = Object.keys(VIDEOJS_I18N_KEY_MAP);

                // Find keys that exist in Video.js but not in our mapping
                const missingKeys = videoJsKeys.filter(
                    (key) => !mappedKeys.includes(key)
                );

                if (missingKeys.length > 0) {
                    console.error(
                        `Missing keys for ${name} (${code}):`,
                        missingKeys
                    );
                    console.error('Add these to VIDEOJS_I18N_KEY_MAP:');
                    missingKeys.forEach((key) => {
                        const safeName = key
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '_')
                            .replace(/^_+|_+$/g, '');
                        console.error(
                            `    '${key}': 'media_player.${safeName}',`
                        );
                    });
                }

                expect(missingKeys).toEqual([]);
            });
        });
    });

    describe('VIDEOJS_I18N_KEY_MAP validity', () => {
        test('should only contain keys that exist in at least one Video.js language file', () => {
            const mappedKeys = Object.keys(VIDEOJS_I18N_KEY_MAP);

            // Collect all unique keys from all language files
            const allVideoJsKeys = new Set();
            LANGUAGE_FILES.forEach(({ data }) => {
                Object.keys(data).forEach((key) => allVideoJsKeys.add(key));
            });

            // Find keys in our mapping that don't exist in any Video.js language file
            const extraKeys = mappedKeys.filter(
                (key) => !allVideoJsKeys.has(key)
            );

            if (extraKeys.length > 0) {
                console.warn(
                    'Keys in mapping but not in any Video.js language file:'
                );
                extraKeys.forEach((key) => {
                    console.warn(`    '${key}'`);
                });
                console.warn('Consider removing these unused mappings.');
            }

            expect(extraKeys).toEqual([]);
        });

        test('should have valid i18n keys (no empty strings)', () => {
            const invalidMappings = Object.entries(VIDEOJS_I18N_KEY_MAP).filter(
                ([, i18nKey]) =>
                    !i18nKey ||
                    typeof i18nKey !== 'string' ||
                    i18nKey.trim() === ''
            );

            expect(invalidMappings).toEqual([]);
        });

        test('should have consistent i18n key naming convention', () => {
            const invalidKeys = Object.entries(VIDEOJS_I18N_KEY_MAP).filter(
                ([, i18nKey]) => {
                    // Check if follows media_player.* pattern
                    return !i18nKey.startsWith('media_player.');
                }
            );

            if (invalidKeys.length > 0) {
                console.error('Keys not following media_player.* convention:');
                invalidKeys.forEach(([videoJsKey, i18nKey]) => {
                    console.error(`    '${videoJsKey}': '${i18nKey}'`);
                });
            }

            expect(invalidKeys).toEqual([]);
        });
    });

    describe('Key coverage analysis', () => {
        test('should provide coverage statistics', () => {
            // Get statistics for the most comprehensive language file (usually English)
            const primaryLang =
                LANGUAGE_FILES.find((lang) => lang.code === 'en') ||
                LANGUAGE_FILES[0];
            const videoJsKeys = Object.keys(primaryLang.data);
            const mappedKeys = Object.keys(VIDEOJS_I18N_KEY_MAP);

            const coveragePercentage =
                (mappedKeys.length / videoJsKeys.length) * 100;

            console.log(`\n📊 Video.js Translation Coverage Statistics:`);
            console.log(
                `   Video.js keys (${primaryLang.name}): ${videoJsKeys.length}`
            );
            console.log(`   Mapped keys: ${mappedKeys.length}`);
            console.log(`   Coverage: ${coveragePercentage.toFixed(1)}%`);

            // We expect high coverage (this test will pass but provides useful info)
            expect(coveragePercentage).toBeGreaterThan(50); // Adjust threshold as needed
        });
    });
});
