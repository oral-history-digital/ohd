import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatDistance } from 'date-fns';

import { useI18n } from 'modules/i18n';
import { useEventTypes } from 'modules/event-types';
import { Spinner } from 'modules/spinners';
import localeToLocaleObject from './localeToLocaleObject';

export default function Event({ event, className }) {
    const { locale } = useI18n();
    const { data: eventTypes, isLoading } = useEventTypes();

    if (isLoading) {
        return <Spinner size="small" />;
    }

    const eventType = eventTypes.find(
        (et) => et.id === Number(event.event_type_id)
    );

    const isInterval = event.start_date !== event.end_date;

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    const distance = formatDistance(endDate, startDate, {
        locale: localeToLocaleObject[locale],
    });

    let dateStr = startDate.toLocaleDateString(locale, { dateStyle: 'medium' });
    if (isInterval) {
        dateStr += `–${endDate.toLocaleDateString(locale, {
            dateStyle: 'medium',
        })}`;
    }

    let title;
    if (isInterval) {
        title = distance;
    } else {
        title = startDate.toLocaleDateString(locale, { dateStyle: 'full' });
    }

    const showDisplayDate = event.display_date !== null;

    return (
        <div className={classNames('Event', className)}>
            <div className="Event-category">{eventType.name}</div>
            {showDisplayDate && (
                <div className="Event-text">{event.display_date}</div>
            )}
            <div
                className={classNames('Event-text', {
                    'Event-text--slight': showDisplayDate,
                })}
            >
                <time
                    dateTime={startDate.toISOString().split('T')[0]}
                    title={title}
                >
                    {dateStr}
                </time>
            </div>
        </div>
    );
}

Event.propTypes = {
    event: PropTypes.object.isRequired,
    className: PropTypes.string,
};
