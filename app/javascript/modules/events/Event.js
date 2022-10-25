import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { useEventTypes } from 'modules/event-types';

export default function Event({
    event
}) {
    const { locale } = useI18n();
    const { data: eventTypes } = useEventTypes();

    if (!eventTypes) {
        return null;
    }

    const eventType = eventTypes.find(et => et.id === event.event_type_id);


    console.log(event, eventType);

    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    let dateStr = startDate.toLocaleDateString(locale, { dateStyle: 'medium' });
    if (event.start_date !== event.end_date) {
        dateStr += `–${endDate.toLocaleDateString(locale, { dateStyle: 'medium' })}`;
    }

    return (
        <li>
            {`${eventType.name}: `}
            {dateStr}
            {event.display_date && ` (${event.display_date})`}
        </li>
    );
}

Event.propTypes = {
    event: PropTypes.object.isRequired
};
