import isNil from 'lodash.isnil';

import isDate from './isDate';
import toDateString from './toDateString';

export default function humanReadable({
    obj,
    attribute,
    collapsed=false,
    none='---',
    translations,
    translationsStatuses,
    optionsScope,
    collections,
    languages,
    locale,
    project,
    dispatch
}) {
    if (obj.translations_attributes) {
        const translation = (Array.isArray(obj.translations_attributes) ?
            obj.translations_attributes.find(t => t.locale === locale) :
            Object.values(obj.translations_attributes).find(t => t.locale === locale))
        return translation?.[attribute];
    }

    let value = obj[attribute];

    if (isNil(value)) {
        return none;
    }

    if (['archive_id', 'signature_original', 'shortname'].includes(attribute)) {
        return value;
    }

    if (attribute === 'duration') {
        return `${value.split(':')[0]} h ${value.split(':')[1]} min`
    }

    if (isDate(value)) {
        return toDateString(value, locale);
    }

    if (attribute === 'collection_id') {
        return collections[value]?.name[locale];
    }

    if (attribute === 'language_id') {
        return languages[value]?.name[locale];
    }

    if (typeof value === 'boolean') {
        return t(`boolean_value.${value}`);
    }

    if (typeof value === 'object' && value !== null) {
        return collapsed ? value[locale]?.substring(0,25) : value[locale];
    }

    const keyParam = `${optionsScope || attribute}-${value}`;
    const keyParams = [ keyParam, value ];

    fetchTranslations({
        keyParams,
        statuses,
        locale,
        project,
        dispatch
    })

    return translations[keyParam]?.value[locale] ||
        translations[value]?.value[locale] ||
        value || none;
}

function fetchTranslations({
    keyParams,
    statuses,
    locale,
    project,
    dispatch
}) {
    keyParams.forEach(keyParam => {
        const fetchStatus = statuses.translations[keyParam];
        if (!fetchStatus) {
            dispatch(fetchData({ locale, project }, 'translations', keyParam));
        }
    });
}
