import reactStringReplace from 'react-string-replace';

export default function t({ locale, translations }, key, params) {
    let text;

    try {
        try {
            eval(`text = translations.${locale}.${key}`);
        } catch (e) {
        } finally {
            if (typeof text !== 'string') {
                eval(`text = translations.${locale}.${defaultKey(key)}`);
            }
        }
    } catch (e) {
    } finally {
        if (typeof text === 'string') {
            if (params) {
                for (let [key, value] of Object.entries(params)) {
                    text = reactStringReplace(text, `%{${key}}`, (match, i) => value);
                }
            }
            return text;
        } else {
            if (developmentMode === 'true') {
                return `translation for ${locale}.${key} is missing!`;
            } else {
                return productionFallback(key);
            }
        }
    }
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
