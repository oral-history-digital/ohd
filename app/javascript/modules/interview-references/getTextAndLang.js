export default function getTextAndLang(texts, locale, originalLang) {
    const localizedText = texts[locale] || texts[`${locale}-public`];
    if (localizedText) {
        return [localizedText, locale];
    }

    const originalText = texts[originalLang] || texts[`${originalLang}-public`];
    if (originalText) {
        return [originalText, originalLang];
    }

    for (const [lang, text] of Object.entries(texts)) {
        return [text, lang.slice(0, 2)];
    }
}
