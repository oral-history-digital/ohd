import { isRtlLanguage } from 'modules/i18n';

import { isDate } from './isDate';
import { parseDate } from './parseDate';

export function toDateString(value, locale) {
    if (!value) return '';

    const date = parseDate(value);
    if (!isDate(date)) return date;

    // Special case: For rtl locales, we use de-DE locale
    // TODO: For real rtl support, we should use the actual locale and adjust rendering accordingly
    const effectiveLocale = isRtlLanguage(locale) ? 'de-DE' : locale;

    return date.toLocaleDateString(localeString(effectiveLocale));
}

function localeString(locale) {
    return locale === 'en' ? 'en-US' : locale;
}

export default toDateString;
