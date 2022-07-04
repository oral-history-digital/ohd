import moment from 'moment';

export default function defaultTitle(interview, locale) {
    moment.locale(locale);
    const shortTitle = interview.short_title?.[locale];
    const now = moment().format('lll');

    return `${interview.archive_id} - ${shortTitle} - ${now}`;
}
