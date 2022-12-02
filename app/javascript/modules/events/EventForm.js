import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getProjectId } from 'modules/archive';
import { getProjects } from 'modules/data';
import { useEventTypes } from 'modules/event-types';
import { useMutatePeople } from 'modules/person';
import { Form, validateDate } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';

export default function EventForm({
    data: event,
    personId,
    formClasses,
    index,
    submitData,
    onSubmit,
    onSubmitCallback,
    onCancel,
}) {
    const projectId = useSelector(getProjectId);
    const projects = useSelector(getProjects);
    const mutatePeople = useMutatePeople();
    const { t, locale } = useI18n();

    const { data: eventTypes, isLoading } = useEventTypes();

    if (isLoading) {
        return <Spinner />;
    }

    const formElements = [
        {
            elementType: 'select',
            attribute: 'event_type_id',
            values: eventTypes,
            value: event?.event_type_id,
            withEmpty: true,
            validate: v => v !== '',
            individualErrorMsg: 'empty',
        },
        {
            elementType: 'input',
            type: 'date',
            attribute: 'start_date',
            validate: validateDate,
            value: event?.start_date,
        },
        {
            elementType: 'input',
            type: 'date',
            attribute: 'end_date',
            validate: validateDate,
            value: event?.end_date,
        },
        {
            elementType: 'input',
            attribute: 'display_date',
            multiLocale: true,
            placeholder: t('modules.events.display_date_placeholder'),
            value: event?.display_date,
            help: 'help_texts.events.display_date'
        },
    ];

    return (
        <Form
            scope="event"
            data={event}
            nested
            values={{
                eventable_id: personId,
            }}
            onSubmit={params => {
                if (typeof submitData === 'function') {
                    submitData({ locale, projectId, projects }, params, index, (updatedEvent) => {
                        const eventHolderId = updatedEvent.eventable_id;

                        mutatePeople(async people => {
                            const eventHolder = people.data[eventHolderId];
                            const events = eventHolder.events;
                            const updatedEventIndex = events.findIndex(event =>
                                event.id === updatedEvent.id);

                            const updatedPeople = {
                                ...people,
                                data: {
                                    ...people.data,
                                    [eventHolderId]: {
                                        ...eventHolder,
                                        events: [
                                            ...events.splice(0, updatedEventIndex),
                                            updatedEvent,
                                            ...events.splice(updatedEventIndex + 1)
                                        ]
                                    }
                                }
                            };

                            return updatedPeople;
                        });
                    });
                }
                if (typeof onSubmit === 'function') {
                    onSubmit();
                }
            }}
            onSubmitCallback={onSubmitCallback}
            onCancel={onCancel}
            formClasses={formClasses}
            elements={formElements}
        />
    );
}

EventForm.propTypes = {
    data: PropTypes.object,
    personId: PropTypes.number,
    index: PropTypes.number,
    formClasses: PropTypes.string,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onSubmitCallback: PropTypes.func,
    onCancel: PropTypes.func,
};
