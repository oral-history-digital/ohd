import reactStringReplace from 'react-string-replace';
import { useSelector } from 'react-redux';

export default function t({ locale, translations, translationsView }, key, params) {
    let text;
    let usingDefault = false;

    if (translations[key]?.[locale]) {
        text = translations[key][locale];
    } else if (translations[defaultKey(key)]?.[locale]) {
        text = translations[defaultKey(key)][locale];
        usingDefault = true;
    } else {
        text = productionFallback(key);
    }

    if(params) {
        for (let [key, value] of Object.entries(params)) {
            text = reactStringReplace(text, `%{${key}}`, (match, i) => (
                value
            ));
        }
    }

    if (translationsView) text.push(usingDefault ? defaultKey(key) : key);
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
