import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@reach/dialog';

import { useI18n } from 'modules/i18n';
import { Form } from 'modules/forms';
import { submitDataWithFetch } from 'modules/api';
import { useMutateData, useMutateDatum } from 'modules/data';
import { usePathBase } from 'modules/routes';

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

    const formElements = [
        {
            elementType: 'select',
            attribute: 'workflow_state',
            values: data && Object.values(data.workflow_states.filter((ws) => ws !== 'correct_project_access_data')),
            value: data?.workflow_state,
            optionsScope: `workflow_states.user${project.is_ohd ? '' : '_project'}s`,
            withEmpty: true,
            handlechangecallback: (name, value) => {
                if (value === 'remove') setShowConfirmDialog(true);
            },
        },
    ];

    if (scope === 'user_project') {
        formElements.push({
            elementType: 'textarea',
            attribute: 'admin_comments',
            value: data?.admin_comments,
        });
    }

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
                    mutateData( async data => {
                        const result = await submitDataWithFetch(pathBase, params);
                        const updatedDatum = result.data;

                        if (userId) {
                            mutateDatum(userId, 'users');
                        }

                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }

                        if (updatedDatum.workflow_state !== 'removed') {
                            return {
                                ...data,
                                data: {
                                    ...data?.data,
                                    [updatedDatum.id]: updatedDatum
                                }
                            }
                        } else {
                            const { [updatedDatum.id]: {}, ...rest } = data?.data;
                            return {data: rest};
                        }
                    });
                }}
                data={data}
                values={{ default_locale: locale }}
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
