import { formatDistance } from 'date-fns';

import localeToLocaleObject from './localeToLocaleObject';

export default function formatEventLong(event, locale) {
    const isInterval = event.start_date !== event.end_date;

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    const distance = formatDistance(endDate, startDate, {
        locale: localeToLocaleObject[locale],
    });

    let title;
    if (isInterval) {
        title = distance;
    } else {
        title = startDate.toLocaleDateString(locale, { dateStyle: 'full' });
    }

    return title;
}
