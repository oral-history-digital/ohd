import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { submitDataWithFetch } from 'modules/api';
import { useMutateData, useMutateDatum } from 'modules/data';
import { usePathBase } from 'modules/routes';

export default function UserForm({
    data,
    userRegistrationId,
    scope,
    locale,
    projectId,
    projects,
    submitData,
    onSubmit,
}) {
    const mutateData = useMutateData('user_registrations');
    const mutateDatum = useMutateDatum();
    const pathBase = usePathBase();

    const formElements = [
        {
            elementType: 'select',
            attribute: 'workflow_state',
            values: data && Object.values(data.workflow_states),
            value: data?.workflow_state,
            optionsScope: 'workflow_states',
            withEmpty: true
        },
    ];

    if (scope === 'user_registration_project') {
        formElements.push({
            elementType: 'textarea',
            attribute: 'admin_comments',
            value: data?.admin_comments,
        });
    }

    return (
        <Form
            scope={scope}
            onSubmit={ async (params) => {
                mutateData( async data => {
                    const result = await submitDataWithFetch(pathBase, params);
                    const updatedDatum = result.data;

                    if (userRegistrationId) {
                        mutateDatum(userRegistrationId, 'user_registrations');
                    }

                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }

                    const updatedData = {
                        ...data,
                        data: {
                            ...data.data,
                            [updatedDatum.id]: updatedDatum
                        }
                    };
                    return updatedData;
                });
            }}
            data={data}
            values={{ default_locale: locale }}
            submitText='submit'
            elements={formElements}
        />
    );
}

UserForm.propTypes = {
    data: PropTypes.object,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
};
