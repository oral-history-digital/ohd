/* global require */
import { useEffect, useMemo } from 'react';

import {
    getLocale,
    getTranslations,
    getTranslationsView,
} from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import { useSelector } from 'react-redux';
import videojs from 'video.js';

import {
    VIDEOJS_I18N_KEY_MAP,
    VIDEOJS_PLUGIN_TRANSLATION_MAP,
} from '../constants';

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
    const isTranslationsView = useSelector(getTranslationsView);
    const project = useSelector(getCurrentProject);

    // Dynamically build LANGS from the project's available_locales.
    // We use synchronous require so bundlers can include only the referenced
    // JSON files at build time. Missing files are skipped with a warning.
    const LANGS = useMemo(() => {
        const codes = project?.available_locales || [];
        return codes
            .map((code) => {
                try {
                    // eslint-disable-next-line global-require
                    const native = require(`video.js/dist/lang/${code}.json`);
                    return { code, native };
                } catch (err) {
                    console.warn(
                        `Video.js language file not found for "${code}", skipping.`
                    );
                    return null;
                }
            })
            .filter(Boolean);
    }, [project?.available_locales]);

    // Create a stable key from available media_player.* translation keys
    const translationKey = useMemo(() => {
        const availableKeys = Object.keys(translations).filter((key) =>
            key.startsWith('media_player.')
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

            if (isTranslationsView) {
                // If translations view is enabled, use the translation key directly
                languageStrings[nativeKey] = i18nKey;
            } else {
                // Check if we have a translation for this key in our translations object
                if (
                    translations[i18nKey] &&
                    translations[i18nKey][currentLanguage]
                ) {
                    const translated = translations[i18nKey][currentLanguage];
                    languageStrings[nativeKey] = translated;
                }
            }
        });

        // Create plugin translations object
        const pluginTranslations = {};

        Object.keys(VIDEOJS_PLUGIN_TRANSLATION_MAP).forEach((pluginKey) => {
            const i18nKey = VIDEOJS_PLUGIN_TRANSLATION_MAP[pluginKey];

            if (isTranslationsView) {
                // If translations view is enabled, use the translation key directly
                pluginTranslations[pluginKey] = i18nKey;
            } else {
                if (
                    translations[i18nKey] &&
                    translations[i18nKey][currentLanguage]
                ) {
                    pluginTranslations[pluginKey] =
                        translations[i18nKey][currentLanguage];
                }
            }
        });

        return {
            language: currentLanguage,
            strings: languageStrings,
            pluginTranslations,
        };
    }, [
        translationKey,
        currentLanguage,
        translations,
        isTranslationsView,
        LANGS,
    ]);

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
