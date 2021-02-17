import { t } from 'modules/i18n';

export function humanReadable(obj, attribute, props, state, none='---') {
    let translation = obj.translations && obj.translations.find(t => t.locale === props.locale)
    let value = state.value || obj[attribute] || (translation && translation[attribute]);

    if (props.optionsScope && props.translations[props.locale][props.optionsScope].hasOwnProperty(value))
        value = t(props, `${props.optionsScope}.${value}`);

    if (props.translations[props.locale][attribute] && props.translations[props.locale][attribute].hasOwnProperty(value))
        value = t(props, `${attribute}.${value}`);

    if (props.translations[props.locale].hasOwnProperty(value))
        value = t(props, value);

    if (/\w+_id/.test(attribute) && attribute !== 'archive_id') // get corresponding name from e.g. collection_id
        value = props.values[value] && props.values[value].name

    if (typeof value === 'object' && value !== null)
        value = value[props.locale]

    if (typeof value === 'string' && state.collapsed)
        value = value.substring(0,25)

    return value || none;
}
