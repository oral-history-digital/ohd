import { useState } from 'react';

import { submitDataWithFetch } from 'modules/api';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

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

/**
 * Edits translated event types with the current project ID from loaded display details.
 * @param {Object} props - Event type and completion/cancel callbacks.
 * @returns {React.ReactElement} Form or project loading/error state.
 */
export default function EventTypeForm({ data, onSubmit, onCancel }) {
    const [isFetching, setIsFetching] = useState(false);
    const pathBase = usePathBase();
    const { project, isLoading, error } = useProject({});
    const { t } = useI18n();
    const mutateEventTypes = useMutateEventTypes();

    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return <Spinner />;

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
