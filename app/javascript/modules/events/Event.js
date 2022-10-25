import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatDistance } from 'date-fns';

import { useI18n } from 'modules/i18n';
import { useEventTypes } from 'modules/event-types';
import localeToLocaleObject from './localeToLocaleObject';

export default function Event({
    event,
    className,
}) {
    const { locale } = useI18n();
    const { data: eventTypes } = useEventTypes();

    if (!eventTypes) {
        return null;
    }

    const eventType = eventTypes.find(et => et.id === event.event_type_id);

    const isInterval = event.start_date !== event.end_date;

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    const distance = formatDistance(endDate, startDate,
        { locale: localeToLocaleObject[locale] });

    let dateStr = startDate.toLocaleDateString(locale, { dateStyle: 'medium' });
    if (isInterval) {
        dateStr += `–${endDate.toLocaleDateString(locale, { dateStyle: 'medium' })}`;
    }

    let title;
    if (isInterval) {
        title = distance;
    } else {
        title = startDate.toLocaleDateString(locale, { dateStyle: 'full' });
    }

    return (
        <li
            className={classNames('Event', className)}
            title={title}
        >
            <div className="Event-type">
                {eventType.name}
            </div>
            <div className="Event-date">
                <time dateTime={startDate.toISOString().split('T')[0]}>
                    {dateStr}
                </time>
            </div>
            {event.display_date && (
                <div className="Event-text">
                    ({event.display_date})
                </div>
            )}
        </li>
    );
}

Event.propTypes = {
    event: PropTypes.object.isRequired,
    className: PropTypes.string,
};
