import { submitDataWithFetch } from 'modules/api';
import { useMutateData, useMutateDatum } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useRestrictedInterviews from './useRestrictedInterviews';

export default function InterviewPermissionForm({ data, dataPath, onSubmit }) {
    const mutateData = useMutateData('users', dataPath);
    const mutateDatum = useMutateDatum();
    const pathBase = usePathBase();
    const { t } = useI18n();
    const { interviews } = useRestrictedInterviews();
    const [filteredInterviews, setFilteredInterviews] = useState(interviews);

    const [checkedInterviewIds, setCheckedInterviewIds] = useState(
        data?.interview_permissions?.map(
            (permission) => permission.interview_id
        ) || []
    );

    if (!interviews) {
        return null;
    }

    const formElements = [
        {
            elementType: 'input',
            type: 'checkbox',
            attribute: 'all',
            value:
                filteredInterviews.length > 0 &&
                checkedInterviewIds.length === filteredInterviews.length,
            handlechangecallback: (name, value) => {
                setCheckedInterviewIds(
                    value
                        ? filteredInterviews.map((interview) => interview.id)
                        : []
                );
            },
        },
    ].concat(
        filteredInterviews
            ?.sort((a, b) =>
                a.archive_id.localeCompare(b.archive_id, undefined, {
                    numeric: true,
                })
            )
            .map((interview) => ({
                elementType: 'input',
                type: 'checkbox',
                attribute: `interview_id[${interview.id}]`,
                handlechangecallback: (name, value) => {
                    setCheckedInterviewIds((prev) => {
                        if (value) {
                            return prev.indexOf(interview.id) === -1
                                ? [...prev, interview.id]
                                : prev;
                        } else {
                            return prev.filter((id) => id !== interview.id);
                        }
                    });
                },
                value: checkedInterviewIds.includes(interview.id),
                label: `${interview.name} (${[
                    interview.archive_id,
                    interview.collection,
                ]
                    .filter(Boolean)
                    .join(', ')})`,
            }))
    );

    return (
        <>
            <input
                type="text"
                placeholder={t('search')}
                onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    setFilteredInterviews(
                        interviews.filter(
                            (interview) =>
                                interview.archive_id.includes(searchTerm) ||
                                interview.name
                                    .toLowerCase()
                                    .includes(searchTerm)
                        )
                    );
                }}
            />
            <Form
                scope={'interview_permission'}
                onSubmit={async () => {
                    mutateData(async (users) => {
                        const result = await submitDataWithFetch(pathBase, {
                            interview_permission: {
                                user_id: data.id,
                                interview_ids: checkedInterviewIds,
                            },
                        });
                        const updatedUser = result.data;
                        const userIndex = users.data.findIndex(
                            (u) => u.id === updatedUser.id
                        );

                        if (updatedUser.id) {
                            mutateDatum(updatedUser.id, 'users');
                        }

                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }

                        if (userIndex === -1) {
                            return users;
                        }

                        const updatedUsers = [
                            ...users.data.slice(0, userIndex),
                            updatedUser,
                            ...users.data.slice(userIndex + 1),
                        ];
                        return { ...users, data: updatedUsers };
                    });
                }}
                values={{ user_id: data?.id }}
                submitText="submit"
                elements={formElements}
                key={`interview-permission-form-${checkedInterviewIds.join(
                    '-'
                )}`}
            />
        </>
    );
}

InterviewPermissionForm.propTypes = {
    data: PropTypes.object,
    dataPath: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
};
