import reactStringReplace from 'react-string-replace';

import { fetchData } from 'modules/data';

export default function t(
    {
        locale,
        translationValues,
        translationsView,
        statuses,
        project,
        dispatch
    }, key, params
) {
    const keyParam = key.replace(/\./g, '-');
    const fetchStatus = statuses.translation_values[keyParam];
    const fetched = /^fetched/.test(fetchStatus);
    const translationValue = translationValues[keyParam]?.value[locale];

    const defaultKeyParam = defaultKey(key)?.replace(/\./g, '-');
    const defaultFetchStatus = statuses.translation_values[defaultKeyParam];
    const defaultFetched = /^fetched/.test(defaultFetchStatus);
    const defaultTranslationValue = translationValues[defaultKeyParam]?.value[locale];

    if (!fetchStatus) {
        dispatch(fetchData({ locale, project }, 'translation_values', keyParam));
    }
    if (
        /^fetched/.test(fetchStatus) &&
        !translationValue &&
        !defaultFetchStatus
    ) {
        dispatch(fetchData({ locale, project }, 'translation_values', defaultKeyParam));
    }

    let text = translationValue || defaultTranslationValue || productionFallback(key);

    if(params) {
        for (let [key, value] of Object.entries(params)) {
            text = reactStringReplace(text, `%{${key}}`, (match, i) => (
                value
            ));
        }
    }

    const usedKey = !translationValue && defaultTranslationValue ? defaultKey(key) : key;

    if (translationsView) {
        Array.isArray(text) ?
            text.push(` (${usedKey})`) :
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
