import { useState } from 'react';
import PropTypes from 'prop-types';

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

    const [checkedInterviewIds, setCheckedInterviewIds] = useState(
        data?.interview_permissions?.map(permission => permission.interview_id) || []
    );

    if (!interviews) {
        return null;
    }

    const formElements = [{
        elementType: 'input',
        type: 'checkbox',
        attribute: 'all',
        value: checkedInterviewIds.length === interviews.length,
        handlechangecallback: (name, value) => {
            setCheckedInterviewIds(value ? interviews.map(interview => interview.id) : []);
        },
    }].concat(interviews?.map(interview => ({
        elementType: 'input',
        type: 'checkbox',
        attribute: `interview_id[${interview.id}]`,
        handlechangecallback: (name, value) => {
            setCheckedInterviewIds(prev => {
                if (value) {
                    return [...prev, interview.id];
                } else {
                    return prev.filter(id => id !== interview.id);
                }
            });
        },
        value: checkedInterviewIds.includes(interview.id),
        label: interview.name,
    })));

    return (
        <>
            <Form
                scope={'interview_permission'}
                onSubmit={ async (params) => {
                    mutateData( async users => {
                        const result = await submitDataWithFetch(pathBase, {interview_permission: { user_id: data.id, interview_ids: checkedInterviewIds } })
                        const updatedUser = result.data;
                        const userIndex = users.data.findIndex(u => u.id === updatedUser.id);

                        if (updatedUser.id) {
                            mutateDatum(updatedUser.id, 'users');
                        }

                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }

                        if (userIndex === -1) {
                            return users;
                        }

                        const updatedUsers = [...users.data.slice(0, userIndex), updatedUser, ...users.data.slice(userIndex + 1)];
                        return { ...users, data: updatedUsers };
                    });
                }}
                values={{ user_id: data?.id }}
                submitText='submit'
                elements={formElements}
                key={`interview-permission-form-${checkedInterviewIds.join('-')}`}
            />
        </>
    );
}

InterviewPermissionForm.propTypes = {
    data: PropTypes.object,
    onSubmit: PropTypes.func,
};

