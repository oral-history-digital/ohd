import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@reach/dialog';

import { Form } from 'modules/forms';
import { submitDataWithFetch } from 'modules/api';
import { useMutateData, useMutateDatum, useSensitiveData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import useRestrictedInterviews from './useRestrictedInterviews';

export default function InterviewPermissionForm({
    data,
    dataPath,
    onSubmit,
}) {
    const mutateData = useMutateData('users', dataPath);
    const mutateDatum = useMutateDatum();
    const pathBase = usePathBase();
    const { interviews } = useRestrictedInterviews();

    if (!interviews) {
        return null;
    }

    const formElements = [{
        values: interviews,
        elementType: 'select',
        attribute: 'interview_id',
        withEmpty: true,
    }];

    return (
        <>
            <Form
                scope={'interview_permission'}
                onSubmit={ async (params) => {
                    mutateData( async users => {
                        const result = await submitDataWithFetch(pathBase, params);
                        const updatedUser = result.data;
                        const userIndex = users.data.findIndex(u => u.id === updatedUser.id);
                        console.log('userIndex', userIndex);
                        console.log('UserId', updatedUser.id);

                        if (updatedUser.id) {
                            mutateDatum(updatedUser.id, 'users');
                        }

                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }

                        if (userIndex === -1) {
                            console.error('User not found in the list');
                            return users;
                        }

                        const updatedUsers = [...users.data.slice(0, userIndex), updatedUser, ...users.data.slice(userIndex + 1)];
                        return { ...users, data: updatedUsers };
                    });
                }}
                values={{ user_id: data?.id }}
                submitText='submit'
                elements={formElements}
            />
        </>
    );
}

InterviewPermissionForm.propTypes = {
    data: PropTypes.object,
    onSubmit: PropTypes.func,
};

