import { useState } from 'react';

import { submitDataWithFetch } from 'modules/api';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

import { useMutatePeople, useMutatePersonWithAssociations } from './hooks';

export default function BiographicalEntryForm({
    biographicalEntry,
    person,
    locale,
    projectId,
    projects,
    submitData,
    onSubmit,
    onCancel,
}) {
    const [isFetching, setIsFetching] = useState(false);
    const mutatePeople = useMutatePeople();
    const mutatePersonWithAssociations = useMutatePersonWithAssociations();
    const pathBase = usePathBase();

    return (
        <Form
            scope="biographical_entry"
            onSubmit={async (params) => {
                mutatePeople(async (people) => {
                    const id = person?.id || biographicalEntry?.person_id;
                    setIsFetching(true);
                    const result = await submitDataWithFetch(pathBase, params);
                    const updatedPerson = result.data;

                    setIsFetching(false);
                    if (id) {
                        mutatePersonWithAssociations(id);
                    }

                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }

                    const updatedPeople = {
                        ...people,
                        data: {
                            ...people.data,
                            [updatedPerson.id]: updatedPerson,
                        },
                    };
                    return updatedPeople;
                });
            }}
            onCancel={onCancel}
            data={biographicalEntry}
            helpTextCode="biographical_entry_form"
            values={{
                person_id: person?.id || biographicalEntry?.person_id,
            }}
            elements={[
                {
                    elementType: 'textarea',
                    attribute: 'text',
                    value: biographicalEntry?.text[locale],
                    validate: function (v) {
                        return v?.length > 1;
                    },
                    multiLocale: true,
                },
                {
                    attribute: 'start_date',
                    value: biographicalEntry?.start_date[locale],
                    multiLocale: true,
                },
                {
                    attribute: 'end_date',
                    value: biographicalEntry?.end_date[locale],
                    multiLocale: true,
                },
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: ['unshared', 'public'],
                    value: biographicalEntry?.workflow_state,
                    optionsScope: 'workflow_states',
                },
            ]}
            fetching={isFetching}
        />
    );
}

BiographicalEntryForm.propTypes = {
    biographicalEntry: PropTypes.object,
    person: PropTypes.object,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
