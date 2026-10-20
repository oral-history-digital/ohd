import { useEventTypes } from 'modules/event-types';
import { Form, validateDate } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import {
    useMutatePeople,
    useMutatePersonLandingPageMetadata,
    useMutatePersonWithAssociations,
} from 'modules/person';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

/**
 * Edits a nested person event and refreshes person caches after a saved update.
 *
 * @param {Object} props - Event editing context.
 * @param {Object} [props.data] - Existing event.
 * @param {number} [props.personId] - Person owning the event.
 * @param {string} [props.formClasses] - Additional form classes.
 * @param {number} [props.index] - Position of a new nested event.
 * @param {Function} props.submitData - Redux save action or nested-form insertion callback.
 * @param {Function} [props.onSubmit] - Closes the event form after submission.
 * @param {Function} [props.onSubmitCallback] - Completion callback managed by the form.
 * @param {Function} [props.onCancel] - Cancels editing.
 * @returns {React.ReactElement} Event form or loading indicator.
 */
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
    const pathBase = usePathBase();
    const mutatePeople = useMutatePeople();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const mutatePersonLandingPageMetadata =
        useMutatePersonLandingPageMetadata();

    const { t } = useI18n();

    const { data: eventTypes, isLoading } = useEventTypes();

    if (isLoading) {
        return <Spinner />;
    }

    const handleEventUpdate = (updatedEvent) => {
        const eventHolderId = updatedEvent.eventable_id;

        mutatePeople(async (people) => {
            const eventHolder = people.data[eventHolderId];
            const events = eventHolder.events;
            const updatedEventIndex = events.findIndex(
                (event) => event.id === updatedEvent.id
            );

            const updatedPeople = {
                ...people,
                data: {
                    ...people.data,
                    [eventHolderId]: {
                        ...eventHolder,
                        events: [
                            ...events.slice(0, updatedEventIndex),
                            updatedEvent,
                            ...events.slice(updatedEventIndex + 1),
                        ],
                    },
                },
            };

            return updatedPeople;
        });

        if (eventHolderId) {
            mutatePersonWithAssociations(eventHolderId);
            mutatePersonLandingPageMetadata(eventHolderId);
        }
    };

    const formElements = [
        {
            elementType: 'select',
            attribute: 'event_type_id',
            values: eventTypes,
            value: event?.event_type_id,
            withEmpty: true,
            validate: (v) => v !== '',
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
            help: 'help_texts.events.display_date',
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
            onSubmit={(params) => {
                if (typeof submitData === 'function') {
                    // For nested forms, submitData can be either:
                    // 1. Redux action (existing items): signature is (props, params, opts, callback)
                    //    - index/callback params are ignored by Redux action
                    // 2. Form's handleNestedFormSubmit (new items): signature is (dummy, params, index)
                    //    - index is used to insert item at correct array position
                    // The forms module routes to the correct handler based on element.id
                    submitData({ pathBase }, params, index, handleEventUpdate);
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
