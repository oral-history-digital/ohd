export default function getDataDisplayName(data, locale) {
    if (data.title && data.type !== 'Person') {
        return data.title;
    }

    if (data.name_type === 'Personal' && data.first_name && data.last_name) {
        const firstName = data.first_name.hasOwnProperty(locale)
            ? data.first_name[locale]
            : data.first_name;
        const lastName = data.last_name.hasOwnProperty(locale)
            ? data.last_name[locale]
            : data.last_name;

        return `${firstName} ${lastName}`;
    }

    if (data.name) {
        return data.name.hasOwnProperty(locale) ? data.name[locale] : data.name;
    }

    return data.code;
}
