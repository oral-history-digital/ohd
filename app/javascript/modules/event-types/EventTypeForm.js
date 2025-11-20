import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { submitDataWithFetch } from 'modules/api';
import { getCurrentProject } from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import useMutateEventTypes from './useMutateEventTypes';

const formElements = [
    {
        attribute: 'code',
        required: true,
    },
    {
        attribute: 'name',
        multiLocale: true,
    },
];

export default function EventTypeForm({ data, onSubmit, onCancel }) {
    const [isFetching, setIsFetching] = useState(false);
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);
    const mutateEventTypes = useMutateEventTypes();

    return (
        <Form
            data={data}
            values={{ project_id: project.id }}
            scope="event_type"
            onSubmit={async (params) => {
                mutateEventTypes(async (eventTypes) => {
                    const id = params.event_type.id;
                    setIsFetching(true);
                    const updatedEventType = await submitDataWithFetch(
                        pathBase,
                        params
                    );

                    // Other stuff that needs to be done after result is returned.
                    setIsFetching(false);

                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }

                    let updatedEventTypes;
                    if (id) {
                        updatedEventTypes = eventTypes.map((et) => {
                            if (et.id === id) {
                                return updatedEventType;
                            } else {
                                return et;
                            }
                        });
                    } else {
                        updatedEventTypes = [...eventTypes, updatedEventType];
                    }

                    return updatedEventTypes;
                });
            }}
            onCancel={onCancel}
            submitText="submit"
            elements={formElements}
            fetching={isFetching}
        />
    );
}

EventTypeForm.propTypes = {
    data: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
