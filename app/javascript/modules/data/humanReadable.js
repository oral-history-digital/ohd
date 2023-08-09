import isNil from 'lodash.isnil';

import { t } from 'modules/i18n';
import { pluralize } from 'modules/strings';

/**
 * Needs in props at most: optionsScope, translations, locale, values
 */

export default function humanReadable(obj, attribute, props, state, none='---') {
    let translation = obj.translations_attributes &&
        (Array.isArray(obj.translations_attributes) ? obj.translations_attributes.find(t => t.locale === props.locale) :
        Object.values(obj.translations_attributes).find(t => t.locale === props.locale))

    let value;
    if (!isNil(state.value)) {
        value = state.value;
    } else if (!isNil(obj[attribute])) {
        value = obj[attribute];
    } else {
        value = translation && translation[attribute];
    }

    if (props.optionsScope && props.translations[props.locale][props.optionsScope].hasOwnProperty(value)) {
        value = t(props, `${props.optionsScope}.${value}`);
    }

    if (props.translations[props.locale][attribute] && props.translations[props.locale][attribute].hasOwnProperty(value)) {
        value = t(props, `${attribute}.${value}`);
    }

    if (typeof value === 'string' && props.translations[props.locale].hasOwnProperty(value) && attribute !== 'shortname') {
        value = t(props, value);
    }

    if (/\w+_id/.test(attribute) && attribute !== 'archive_id') { // get corresponding name from e.g. collection_id
        if (props.values) {
            value = props.values[value]?.name
        } else {
            let associatedData = pluralize(attribute.substring(0, attribute.length - 3));
            value = props[associatedData] && props[associatedData][value]?.name
        }
    }

    if (typeof value === 'object' && value !== null) {
        value = value[props.locale];
    }

    if (attribute === 'duration') {
        value = `${value.split(':')[0]} h ${value.split(':')[1]} min`
    }

    if (typeof value === 'string' && state.collapsed) {
        value = value.substring(0,25)
    }

    if (typeof value === 'boolean') {
        return t(props, `boolean_value.${value}`);
    }

    return value || none;
}
