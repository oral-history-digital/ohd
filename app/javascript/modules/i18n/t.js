import reactStringReplace from 'react-string-replace';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchData, getStatuses } from 'modules/data';
import { useProject } from 'modules/routes';

export default function t({ locale, translations, translationsView }, key, params) {
    const { project, projectId } = useProject();
    const statuses = useSelector(getStatuses);
    const dispatch = useDispatch();

    const keyParam = key.replace(/\./g, '-');

    useEffect(() => {
        if (!statuses.translation_values[key]) {
            dispatch(fetchData({ projectId, locale, project }, 'translation_values', keyParam));
        }
    }, [statuses.translation_values[key]]);

    let text;
    let usingDefault = false;

    if (translations[keyParam]?.value[locale]) {
        text = translations[keyParam].value[locale];
    } else if (translations[defaultKey(keyParam)]?.value[locale]) {
        text = translations[defaultKey(keyParam)].value[locale];
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

    const usedKey = usingDefault ? defaultKey(key) : key;

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
