import { useI18n } from 'modules/i18n';
import { useEffect, useMemo } from 'react';
import videojs from 'video.js';
import langDe from 'video.js/dist/lang/de.json';
import langEl from 'video.js/dist/lang/el.json';
import langEn from 'video.js/dist/lang/en.json';
import langEs from 'video.js/dist/lang/es.json';
import langRu from 'video.js/dist/lang/ru.json';
import { VIDEOJS_I18N_KEY_MAP } from '../constants';

const LANGS = [
    { code: 'de', native: langDe },
    { code: 'el', native: langEl },
    { code: 'en', native: langEn },
    { code: 'es', native: langEs },
    { code: 'ru', native: langRu },
];

/**
 * Custom React hook for overriding Video.js translations with our i18n system.
 *
 * This hook bridges Video.js native language support with our application's
 * internationalization system, allowing us to provide custom translations
 * for Video.js player controls and messages.
 *
 * How it works:
 * 1. Detects the current language from the i18n system
 * 2. Loads the corresponding Video.js native language strings as base
 * 3. Checks our i18n system for custom translations using VIDEOJS_I18N_KEY_MAP
 * 4. Overrides Video.js strings with custom translations when available
 * 5. Registers the merged language strings with Video.js
 * 6. Sets the language as active in Video.js
 *
 * @returns {Object|null} Object with language code and merged strings, or null if not ready
 * @returns {string} returns.language - Current language code (e.g., 'en', 'de')
 * @returns {Object} returns.strings - Complete Video.js language strings with custom overrides
 */
function useVideojsLanguages() {
    const { t, i18n } = useI18n();

    // Get current language
    const currentLanguage = useMemo(() => {
        return (
            i18n?.language ||
            i18n?.lng ||
            document.documentElement.lang ||
            navigator.language?.substring(0, 2) ||
            'de'
        );
    }, [i18n?.language, i18n?.lng]);

    // Create custom language strings with i18n overrides
    const customLanguageStrings = useMemo(() => {
        if (!t || typeof t !== 'function') {
            return null;
        }

        // Find the native language data
        const langData = LANGS.find((lang) => lang.code === currentLanguage);
        if (!langData) {
            return null;
        }

        // Start with native strings and apply custom overrides
        const languageStrings = { ...langData.native };

        Object.keys(VIDEOJS_I18N_KEY_MAP).forEach((nativeKey) => {
            const i18nKey = VIDEOJS_I18N_KEY_MAP[nativeKey];
            try {
                const translated = t(i18nKey);
                if (
                    translated &&
                    typeof translated === 'string' &&
                    translated !== i18nKey
                ) {
                    languageStrings[nativeKey] = translated;
                }
            } catch (error) {
                // Silently ignore translation errors
            }
        });

        return { language: currentLanguage, strings: languageStrings };
    }, [t, currentLanguage]);

    // Apply the custom language strings to Video.js
    useEffect(() => {
        if (!customLanguageStrings) {
            return;
        }

        const { language, strings } = customLanguageStrings;

        // Add the language with custom strings
        videojs.addLanguage(language, strings);

        // Set as current language
        videojs.options.language = language;
    }, [customLanguageStrings]);

    return customLanguageStrings;
}

export default useVideojsLanguages;
