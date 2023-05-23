import reactStringReplace from 'react-string-replace';

export default function t({ locale, translations }, key, params) {
    let text, textWithReplacements, defaultKey;
    let keyArray = key.split('.');
    let productionFallback = keyArray[keyArray.length - 1];

    if (keyArray.length > 2) {
        keyArray[keyArray.length - 2] = 'default';
        defaultKey = keyArray.join('.');
    }

    try {
        try {
            eval(`text = translations.${locale}.${key}`);
        } catch (e) {
        } finally {
            if (typeof(text) !== 'string') {
                eval(`text = translations.${locale}.${defaultKey}`);
            }
        }
    } catch (e) {
    } finally {
        if (typeof(text) === 'string') {
            if(params) {
                for (let [key, value] of Object.entries(params)) {
                    text = reactStringReplace(text, `%{${key}}`, (match, i) => (
                        value
                    ));
                }
            }
            return text
        } else {
            if (developmentMode === 'true') {
                return `translation for ${locale}.${key} is missing!`;
            } else {
                return productionFallback;
            }
        }
    }
}
