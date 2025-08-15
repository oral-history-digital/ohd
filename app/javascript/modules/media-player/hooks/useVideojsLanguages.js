import { getLocale, getTranslations } from 'modules/archive';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import videojs from 'video.js';
import langDe from 'video.js/dist/lang/de.json';
import langEl from 'video.js/dist/lang/el.json';
import langEn from 'video.js/dist/lang/en.json';
import langEs from 'video.js/dist/lang/es.json';
import langRu from 'video.js/dist/lang/ru.json';
import {
    VIDEOJS_I18N_KEY_MAP,
    VIDEOJS_PLUGIN_TRANSLATION_MAP,
    VIDEOJS_SUBTITLE_LANGUAGES,
} from '../constants';
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
 * 1. Detects the current language from the Redux store (via getLocale)
 * 2. Loads the corresponding Video.js native language strings as base
 * 3. Checks our i18n system for custom translations using VIDEOJS_I18N_KEY_MAP
 * 4. Overrides Video.js strings with custom translations when available
 * 5. Registers the merged language strings with Video.js
 * 6. Sets the language as active in Video.js
 * 7. Provides plugin translations for custom components
 *
 * @returns {Object|null} Object with language code, merged strings, and plugin translations, or null if not ready
 * @returns {string} returns.language - Current language code (e.g., 'en', 'de')
 * @returns {Object} returns.strings - Complete Video.js language strings with custom overrides
 * @returns {Object} returns.pluginTranslations - Translations for custom plugins
 */
function useVideojsLanguages() {
    const currentLanguage = useSelector(getLocale);
    const translations = useSelector(getTranslations);

    // Create a stable key based on current language and available translations
    const translationKey = useMemo(() => {
        // Create a stable key from language + available translation keys
        // Include both media_player.* keys and language code keys (for subtitle language names)
        const availableKeys = Object.keys(translations).filter(
            (key) =>
                key.startsWith('media_player.') ||
                VIDEOJS_SUBTITLE_LANGUAGES.includes(key)
        );
        return `${currentLanguage}-${availableKeys.sort().join(',')}`;
    }, [currentLanguage, translations]);

    // Create custom language strings with i18n overrides
    const customLanguageStrings = useMemo(() => {
        if (!translationKey || !translations) {
            return null;
        }

        // Find the native language data
        const langData = LANGS.find((lang) => lang.code === currentLanguage);
        if (!langData) {
            console.warn(`No language data found for: ${currentLanguage}`);
            return null;
        }

        // Start with native strings and apply custom overrides
        const languageStrings = { ...langData.native };

        Object.keys(VIDEOJS_I18N_KEY_MAP).forEach((nativeKey) => {
            const i18nKey = VIDEOJS_I18N_KEY_MAP[nativeKey];

            // Check if we have a translation for this key in our translations object
            if (
                translations[i18nKey] &&
                translations[i18nKey][currentLanguage]
            ) {
                const translated = translations[i18nKey][currentLanguage];
                languageStrings[nativeKey] = translated;
            }
        });

        // Create plugin translations object
        const pluginTranslations = {};

        Object.keys(VIDEOJS_PLUGIN_TRANSLATION_MAP).forEach((pluginKey) => {
            const i18nKey = VIDEOJS_PLUGIN_TRANSLATION_MAP[pluginKey];
            if (
                translations[i18nKey] &&
                translations[i18nKey][currentLanguage]
            ) {
                pluginTranslations[pluginKey] =
                    translations[i18nKey][currentLanguage];
            }
        });

        return {
            language: currentLanguage,
            strings: languageStrings,
            pluginTranslations,
        };
    }, [translationKey, currentLanguage, translations]);

    // Apply the custom language strings to Video.js globally
    useEffect(() => {
        if (customLanguageStrings) {
            const { language, strings } = customLanguageStrings;
            // Only add the language strings to Video.js, don't set as current
            videojs.addLanguage(language, strings);
        }
    }, [customLanguageStrings]);

    return customLanguageStrings;
}

export default useVideojsLanguages;
