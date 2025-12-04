export default function formatEventShort(event, locale) {
    const isInterval = event.start_date !== event.end_date;

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    let dateStr = startDate.toLocaleDateString(locale, { dateStyle: 'medium' });
    if (isInterval) {
        dateStr += `–${endDate.toLocaleDateString(locale, { dateStyle: 'medium' })}`;
    }

    const value = event.display_date ? event.display_date : dateStr;

    return value;
}
