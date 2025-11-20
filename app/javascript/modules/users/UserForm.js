import { useState } from 'react';

import { Dialog } from '@reach/dialog';
import { submitDataWithFetch } from 'modules/api';
import { useMutateData, useMutateDatum, useSensitiveData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { t as originalT } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

export default function UserForm({
    data,
    dataPath,
    userId,
    scope,
    translationsView,
    translations,
    project,
    onSubmit,
}) {
    const mutateData = useMutateData('users', dataPath);
    const mutateDatum = useMutateDatum();
    const pathBase = usePathBase();
    const { t } = useI18n();

    useSensitiveData(project, ['contact_email']);

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [workflowState, setWorkflowState] = useState(false);
    const responseLocale =
        project.available_locales.indexOf(data.default_locale) > -1
            ? data.default_locale
            : project.default_locale;
    const conditionsLink = `${project.domain_with_optional_identifier}/${responseLocale}/conditions`;
    const conditionsLinkTitle = originalT(
        { translations, translationsView, locale: responseLocale },
        'user.tos_agreement'
    );
    const projectLink =
        data.pre_access_location ||
        `${project.domain_with_optional_identifier}/${responseLocale}`;
    let correctHref = `${project.domain_with_optional_identifier}/${responseLocale}`;
    correctHref +=
        '?correct_user_data=true&access_token=ACCESS_TOKEN_WILL_BE_REPLACED';
    const correctLinkTitle = originalT(
        { translations, translationsView, locale: responseLocale },
        'user.correct_link'
    );

    const mailText = workflowState
        ? originalT(
              { translations, translationsView, locale: responseLocale },
              `devise.mailer.${workflowState}.text`,
              {
                  project_name: project.name[responseLocale],
                  project_link: `<a href='${projectLink}' target="_blank" title="Externer Link" rel="noreferrer">${project.name[responseLocale]}</a>`,
                  tos_link: `<a href='${conditionsLink}' target="_blank" title="Externer Link" rel="noreferrer">${conditionsLinkTitle}</a>`,
                  user_display_name: `${data.first_name} ${data.last_name}`,
                  mail_to: `<a href='mailto:${project.contact_email}'>${project.contact_email}</a>`,
                  correct_link: `<a href='${correctHref}'>${correctLinkTitle}</a>`,
              }
          ).join('')
        : '';

    const formElements = [
        {
            elementType: 'select',
            attribute: 'workflow_state',
            values:
                data &&
                Object.values(
                    data.workflow_states.filter(
                        (ws) =>
                            ws !== 'correct_project_access_data' &&
                            ws !== 'request_project_access'
                    )
                ),
            value: data?.workflow_state,
            optionsScope: `workflow_states.user${
                project.is_ohd ? '' : '_project'
            }s`,
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
            value: mailText,
            validate: (v) => v && v.length > 100,
        },
    ];

    return (
        <>
            <Dialog
                aria-label="confirm-rm"
                isOpen={showConfirmDialog}
                onDismiss={close}
                className={'Modal-dialog'}
            >
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
                onSubmit={async (params) => {
                    mutateData(async (users) => {
                        const result = await submitDataWithFetch(pathBase, {
                            user_project: {
                                mail_text: mailText,
                                ...params.user_project,
                            },
                        });
                        const updatedDatum = result.data;
                        const userIndex = users.data.findIndex(
                            (u) => u.id === userId
                        );

                        if (updatedDatum.id) {
                            mutateDatum(userId, 'users');
                        }

                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }

                        if (userIndex === -1) {
                            console.error('User not found in the list');
                            return users;
                        }

                        let updatedUsers;
                        if (updatedDatum.workflow_state !== 'removed') {
                            updatedUsers = [
                                ...users.data.slice(0, userIndex),
                                updatedDatum,
                                ...users.data.slice(userIndex + 1),
                            ];
                        } else {
                            updatedUsers = [
                                ...users.data.slice(0, userIndex),
                                ...users.data.slice(userIndex + 1),
                            ];
                        }
                        return { ...users, data: updatedUsers };
                    });
                }}
                values={{ id: data?.id }}
                submitText="submit"
                elements={formElements}
            />
        </>
    );
}

UserForm.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        default_locale: PropTypes.string,
        workflow_states: PropTypes.arrayOf(PropTypes.string),
        workflow_state: PropTypes.string,
        pre_access_location: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
    }),
    dataPath: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    scope: PropTypes.string,
    translationsView: PropTypes.string,
    translations: PropTypes.object,
    project: PropTypes.shape({
        available_locales: PropTypes.arrayOf(PropTypes.string),
        default_locale: PropTypes.string,
        domain_with_optional_identifier: PropTypes.string,
        name: PropTypes.object,
        contact_email: PropTypes.string,
        is_ohd: PropTypes.bool,
    }).isRequired,
    onSubmit: PropTypes.func,
};
