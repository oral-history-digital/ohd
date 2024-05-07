import reactStringReplace from 'react-string-replace';

export default function t(
    {
        locale,
        translations,
        translationsView,
    }, key, params
) {
    const translation = translations[key]?.[locale];
    const defaultTranslation = translations[defaultKey(key)]?.[locale];

    let text = translation || defaultTranslation || productionFallback(key);

    if(params) {
        for (let [key, value] of Object.entries(params)) {
            text = reactStringReplace(text, `%{${key}}`, (match, i) => (
                value
            ));
        }
    }

    if (Array.isArray(text)) text = text.join('');

    if (translationsView) {
        const usedKey = !translation && defaultTranslation ? defaultKey(key) : key;
        text += ` (${usedKey})`;
    }

    return text;
}

function defaultKey(key) {
    const keyArray = key.split('.');

    if (keyArray.length <= 2) {
        return undefined;
    }

    keyArray[keyArray.length - 2] = 'default';
    return keyArray.join('.');
}

function productionFallback(key) {
    const keyArray = key.split('.');
    return keyArray[keyArray.length - 1];
}
