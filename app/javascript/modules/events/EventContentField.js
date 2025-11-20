import { useEventTypes } from 'modules/event-types';
import { ContentField } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import formatEventShort from './formatEventShort';

export default function EventContentField({ label, events, className }) {
    const { locale } = useI18n();
    const { data: eventTypes } = useEventTypes();

    if (!eventTypes) {
        return null;
    }

    const eventType = eventTypes.find(
        (et) => et.id === events[0].event_type_id
    );
    const formattedEvents = events.map((event) =>
        formatEventShort(event, locale)
    );

    return (
        <ContentField
            label={label || eventType.name}
            value={formattedEvents}
            className={className}
        />
    );
}

EventContentField.propTypes = {
    label: PropTypes.string,
    events: PropTypes.array.isRequired,
    className: PropTypes.string,
};
