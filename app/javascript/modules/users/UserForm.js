import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@reach/dialog';

import { useI18n } from 'modules/i18n';
import { Form } from 'modules/forms';
import { submitDataWithFetch } from 'modules/api';
import { useMutateData, useMutateDatum } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { findExternalLink } from 'modules/layout';
import { OHD_DOMAINS } from 'modules/constants';

export default function UserForm({
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

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [workflowState, setWorkflowState] = useState(false);
    const conditionsLink = findExternalLink(project, 'conditions');

    const formElements = [
        {
            elementType: 'select',
            attribute: 'workflow_state',
            values: data && Object.values(data.workflow_states.filter((ws) => ws !== 'correct_project_access_data' && ws !== 'request_project_access')),
            value: data?.workflow_state,
            optionsScope: `workflow_states.user${project.is_ohd ? '' : '_project'}s`,
            withEmpty: true,
            handlechangecallback: (name, value) => {
                if (value === 'remove') setShowConfirmDialog(true);
                setWorkflowState(value);
            },
        },
        {
            //elementType: 'richTextEditor',
            elementType: 'textarea',
            attribute: 'mail_text',
            value: workflowState ? t(`devise.mailer.${workflowState}.text`, {
                project_name: project.name[locale],
                tos_link: `<a href='${conditionsLink[locale]}' target="_blank" title="Externer Link" rel="noreferrer">${t('user.tos_agreement')}</a>`,
                user_display_name: `${data.first_name} ${data.last_name}`,
                mail_to: `<a href='mailto:${project.contact_email}'>${project.contact_email}</a>`,
                correct_link: `<a href='${project.archive_domain || OHD_DOMAINS[railsMode]}${pathBase}?access_token=ACCESS_TOKEN_WILL_BE_REPLACED'>${t('user.correct_link')}</a>`,
            }).join('') : '',
            validate: (v) => (v && v.length > 100),
        },
    ];

    return (
        <>
            <Dialog isOpen={showConfirmDialog} onDismiss={close} className={'Modal-dialog'} >
                <h2>{t('Soll dieser Nutzer*innen-Account wirklich endgültig aus der Datenbank gelöscht werden?')}</h2>
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
                values={{ id: data?.id }}
                submitText='submit'
                elements={formElements}
            />
        </>
    );
}

UserForm.propTypes = {
    data: PropTypes.object,
    locale: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
};
