import isNil from 'lodash.isnil';
import isDate from './isDate';
import toDateString from './toDateString';

export default function humanReadable({
    obj,
    attribute,
    collapsed = false,
    none = '---',
    translations,
    optionsScope,
    collections,
    languages,
    locale,
}) {
    if (obj.translations_attributes) {
        const translation = Array.isArray(obj.translations_attributes)
            ? obj.translations_attributes.find((t) => t.locale === locale)
            : Object.values(obj.translations_attributes).find(
                  (t) => t.locale === locale
              );
        const v = translation?.[attribute];
        if (v) return v;
    }

    let value = obj[attribute];

    if (isNil(value)) {
        return none;
    }

    if (['archive_id', 'signature_original', 'shortname'].includes(attribute)) {
        return value;
    }

    if (attribute === 'duration') {
        return `${value.split(':')[0]} h ${value.split(':')[1]} min`;
    }

    if (isDate(value)) {
        return toDateString(value, locale);
    }

    if (attribute === 'collection_id') {
        return collections[value]?.name[locale];
    }

    if (/language_id$/.test(attribute)) {
        return languages[value]?.name[locale];
    }

    if (typeof value === 'boolean') {
        return translations[`boolean_value.${value}`][locale];
    }

    if (Array.isArray(value)) {
        return value.join(',');
    }

    if (typeof value === 'object' && value !== null) {
        return collapsed ? value[locale]?.substring(0, 500) : value[locale];
    }

    const keyParam = `${optionsScope || attribute}.${value}`;

    return (
        translations[keyParam]?.[locale] ||
        translations[value]?.[locale] ||
        value ||
        none
    );
}
