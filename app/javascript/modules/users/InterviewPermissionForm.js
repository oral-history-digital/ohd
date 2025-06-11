import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@reach/dialog';

import { useI18n } from 'modules/i18n';
import { Form } from 'modules/forms';
import { submitDataWithFetch } from 'modules/api';
import { useMutateData, useMutateDatum, useSensitiveData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import useRestrictedInterviews from './useRestrictedInterviews';

export default function InterviewPermissionForm({
    data,
    dataPath,
    userId,
    locale,
    project,
    onSubmit,
}) {
    const mutateData = useMutateData('users', dataPath);
    const mutateDatum = useMutateDatum();
    const pathBase = usePathBase();
    const { t } = useI18n();
    const { interviews } = useRestrictedInterviews();

    if (!interviews) {
        return null;
    }

    const formElements = interviews?.map(interview => ({
        elementType: 'input',
        attribute: 'interview_id',
        type: 'checkbox',
        value: interview.id,
        label: interview.title,
    }));

    return (
        <>
            <Form
                scope={'interview_permission'}
                onSubmit={ async (params) => {
                    mutateData( async users => {
                        const result = await submitDataWithFetch(pathBase, params);
                        const updatedDatum = result.data;
                        const userIndex = users.data.findIndex(u => u.id === userId);

                        if (updatedDatum.id) {
                            mutateDatum(userId, 'users');
                        }

                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }

                        let updatedUsers;
                        if (updatedDatum.workflow_state !== 'removed') {
                            updatedUsers = [...users.data.slice(0, userIndex), updatedDatum, ...users.data.slice(userIndex + 1)];
                        } else {
                            updatedUsers = [...users.data.slice(0, userIndex), ...users.data.slice(userIndex + 1)];
                        }
                        return { ...users, data: updatedUsers };
                    });
                }}
                //values={{ id: data?.id }}
                submitText='submit'
                elements={formElements}
            />
        </>
    );
}

InterviewPermissionForm.propTypes = {
    data: PropTypes.object,
    locale: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
};

