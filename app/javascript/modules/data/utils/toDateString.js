import { isDate } from './isDate';
import { parseDate } from './parseDate';

export function toDateString(value, locale) {
    if (!value) return '';

    const date = parseDate(value);
    if (!isDate(date)) return date;

    return date.toLocaleDateString(localeString(locale));
}

function localeString(locale) {
    return locale === 'en' ? 'en-US' : locale;
}

export default toDateString;
