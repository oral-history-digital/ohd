import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getProjectId } from 'modules/archive';
import { getProjects } from 'modules/data';
import { useEventTypes } from 'modules/event-types';
import { Form } from 'modules/forms';
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
    console.log(event);

    const projectId = useSelector(getProjectId);
    const projects = useSelector(getProjects);
    const { locale } = useI18n();

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
            elementType: 'date',
            attribute: 'start_date',
            validate: v => v !== '',
            required: true,
            value: event?.start_date,
        },
        {
            elementType: 'date',
            attribute: 'end_date',
            validate: v => v !== '',
            required: true,
            value: event?.end_date,
        },
        {
            elementType: 'input',
            attribute: 'display_date',
            multiLocale: true,
            value: event?.display_date,
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
                console.log(params, submitData, onSubmit)

                if (typeof submitData === 'function') {
                    submitData({ locale, projectId, projects }, params, index);
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
