export default function getDataDisplayName(data, locale) {
    if (data.title && data.type !== 'Person') {
        return data.title;
    }

    return data.name?.hasOwnProperty(locale) ?
        data.name[locale] :
        data.name;
}
