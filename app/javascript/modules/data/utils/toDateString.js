export default function toDateString(value, locale) {
    if (!value) {
        return '';
    }
    const trimmedDate = value.trim();
    const date = new Date(trimmedDate);

    if (isNaN(date)) return trimmedDate;

    return date.toLocaleDateString(localeString(locale));
}

function localeString(locale) {
    return locale === 'en' ? 'en-US' : locale;
}
