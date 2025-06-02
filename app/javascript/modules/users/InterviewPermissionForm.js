import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@reach/dialog';

import { useI18n } from 'modules/i18n';
import { Form } from 'modules/forms';
import { submitDataWithFetch } from 'modules/api';
import { useMutateData, useMutateDatum, useSensitiveData } from 'modules/data';
import { usePathBase } from 'modules/routes';

export default function InterviewPermissionForm({
    data,
    dataPath,
    userId,
    scope,
    locale,
    project,
    onSubmit,
}) {
    const mutateData = useMutateData('users', dataPath);
    const mutateDatum = useMutateDatum();
    const pathBase = usePathBase();
    const { t } = useI18n();

    const formElements = restrictedInterviews.map(interview => ({
        elementType: 'input',
        attribute: 'interview_id',
        type: 'checkbox',
    }));

    return (
        <>
            <Dialog aria-label='confirm-rm' isOpen={showConfirmDialog} onDismiss={close} className={'Modal-dialog'} >
                <h2>{t('user.remove_permanently.confirmation.text')}</h2>
                <div className="Form-footer u-mt">
                    <input
                        type="button"
                        className="Button Button--secondaryAction"
                        value={t('cancel')}
                        onClick={() => setShowConfirmDialog(false)}
                    />
                    <input
                        type="button"
                        className="Button Button--primaryAction"
                        value={'OK'}
                        onClick={() => setShowConfirmDialog(false)}
                    />
                </div>
            </Dialog>
            <Form
                scope={scope}
                onSubmit={ async (params) => {
                    mutateData( async users => {
                        const result = await submitDataWithFetch(pathBase, {user_project: {mail_text: mailText, ...params.user_project}});
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
                values={{ id: data?.id }}
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

