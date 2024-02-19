import reactStringReplace from 'react-string-replace';

import { fetchData } from 'modules/data';

export default function t(
    {
        locale,
        translations,
        translationsView,
        statuses,
        project,
        dispatch
    }, key, params
) {
    const keyParam = key.replace(/\./g, '-');
    const fetchStatus = statuses.translations[keyParam];
    const fetched = /^fetched/.test(fetchStatus);
    const translation = translations[keyParam]?.value?.[locale];

    const defaultKeyParam = defaultKey(key)?.replace(/\./g, '-');
    const defaultFetchStatus = statuses.translations[defaultKeyParam];
    const defaultFetched = /^fetched/.test(defaultFetchStatus);
    const defaultTranslation = translations[defaultKeyParam]?.value[locale];

    if (!fetchStatus) {
        dispatch(fetchData({ locale, project }, 'translations', keyParam));
    }
    if (
        /^fetched/.test(fetchStatus) &&
        !translation &&
        !defaultFetchStatus
    ) {
        dispatch(fetchData({ locale, project }, 'translations', defaultKeyParam));
    }

    let text = translation || defaultTranslation || productionFallback(key);

    if(params) {
        for (let [key, value] of Object.entries(params)) {
            text = reactStringReplace(text, `%{${key}}`, (match, i) => (
                value
            ));
        }
    }

    const usedKey = !translation && defaultTranslation ? defaultKey(key) : key;

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
