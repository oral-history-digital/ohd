export default function formatDate(
    value,
    locale,
    options = { dateStyle: 'medium' }
) {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toLocaleDateString(locale, options);
}
