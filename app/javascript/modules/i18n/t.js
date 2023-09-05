import reactStringReplace from 'react-string-replace';

export default function t({ locale, translations }, key, params) {
    let text, textWithReplacements, defaultKey;
    let keyArray = key.split('.');
    let productionFallback = keyArray[keyArray.length - 1];
    let usingDefault = false;

    if (keyArray.length > 2) {
        keyArray[keyArray.length - 2] = 'default';
        defaultKey = keyArray.join('.');
    }

    if (translations[key]?.[locale]) {
        text = translations[key][locale];
    } else if (translations[defaultKey]?.[locale]) {
        text = translations[defaultKey][locale];
        usingDefault = true;
    } else {
        text = productionFallback;
    }

    if(params) {
        for (let [key, value] of Object.entries(params)) {
            text = reactStringReplace(text, `%{${key}}`, (match, i) => (
                value
            ));
        }
    }

    return `${text}${railsMode !== 'production' ? ` (${usingDefault ? defaultKey : key})` : ''}`;
}
