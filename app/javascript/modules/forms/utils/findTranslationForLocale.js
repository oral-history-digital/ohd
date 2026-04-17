import { getMergedTranslations } from './getMergedTranslations';

/**
 * Resolve translation for a locale from persisted + unsaved form state.
 * Segment records may combine fallback values from xx-public translations.
 */
export function findTranslationForLocale(data, formValues, locale) {
    const translationsArray = getMergedTranslations(data, formValues);

    if (translationsArray.length === 0) {
        return null;
    }

    const originalTranslation = translationsArray.find(
        (t) => t.locale === locale
    );
    const publicTranslation = translationsArray.find(
        (t) => t.locale === `${locale}-public`
    );

    if (data?.type !== 'Segment') {
        return originalTranslation;
    }

    if (!originalTranslation) {
        return publicTranslation;
    }

    // From here on only for segments
    const translation = {
        ...originalTranslation,
    };

    if (!translation.text || translation.text === '') {
        translation.text = publicTranslation?.text;
    }
    if (!translation.mainheading || translation.mainheading === '') {
        translation.mainheading = publicTranslation?.mainheading;
    }
    if (!translation.subheading || translation.subheading === '') {
        translation.subheading = publicTranslation?.subheading;
    }

    return translation;
}
