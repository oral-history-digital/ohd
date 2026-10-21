/* global railsMode */
import { useEffect, useState } from 'react';

import { Dialog } from '@reach/dialog';
import { submitDataWithFetch } from 'modules/api';
import {
    fetchTranslationsForLocale,
    getTranslations,
    getTranslationsView,
} from 'modules/archive';
import { OHD_DOMAINS } from 'modules/constants';
import { useMutateData, useMutateDatum } from 'modules/data';
import { Form } from 'modules/forms';
import { t as originalT, useI18n } from 'modules/i18n';
import {
    pathBase as projectPathBase,
    usePathBase,
    useProject,
} from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { underscore } from 'modules/strings';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Edits account or project-access status and previews the notification email in the recipient's language.
 * Waits for authorized project contact data before showing the form; saves through the existing user endpoint.
 *
 * @param {Object} props - User form inputs.
 * @param {Object} props.data - Account or project-access record to edit.
 * @param {string} props.dataPath - User-list cache path to refresh after saving.
 * @param {number|string} props.userId - Account ID in the user list.
 * @param {string} props.scope - Form scope for account or project-access fields.
 * @param {string} props.responseLocale - Recipient language allowed by the current project.
 * @param {Function} [props.onSubmit] - Called after a successful save.
 * @returns {React.ReactElement} Form, loading indicator, or project request error.
 */
export default function UserForm({
    data,
    dataPath,
    userId,
    scope,
    responseLocale,
    onSubmit,
}) {
    const mutateData = useMutateData('users', dataPath);
    const mutateDatum = useMutateDatum();
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const { t } = useI18n();

    const translations = useSelector(getTranslations);
    const translationsView = useSelector(getTranslationsView);
    const { project, isLoading, error } = useProject({
        locale: responseLocale,
        include: ['email_preview'],
    });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [workflowState, setWorkflowState] = useState(false);
    useEffect(() => {
        dispatch(
            fetchTranslationsForLocale(responseLocale, `/${responseLocale}`)
        );
    }, [dispatch, responseLocale]);

    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
            />
        );
    if (isLoading || !project) return <Spinner />;

    const projectUrl = `${project.archive_domain || OHD_DOMAINS[railsMode]}${projectPathBase({ project, locale: responseLocale })}`;
    const conditionsLink = `${projectUrl}/conditions`;
    const conditionsLinkTitle = originalT(
        { translations, translationsView, locale: responseLocale },
        'user.tos_agreement'
    );
    const projectLink = data.pre_access_location || projectUrl;
    let correctHref = projectUrl;
    correctHref +=
        '?correct_user_data=true&access_token=ACCESS_TOKEN_WILL_BE_REPLACED';
    const correctLinkTitle = originalT(
        { translations, translationsView, locale: responseLocale },
        'user.correct_link'
    );

    const mailParts = workflowState
        ? originalT(
              { translations, translationsView, locale: responseLocale },
              `devise.mailer.${workflowState}.text`,
              {
                  project_name: project.name,
                  project_link: `<a href='${projectLink}' target="_blank" title="Externer Link" rel="noreferrer">${project.name}</a>`,
                  tos_link: `<a href='${conditionsLink}' target="_blank" title="Externer Link" rel="noreferrer">${conditionsLinkTitle}</a>`,
                  user_display_name: `${data.first_name} ${data.last_name}`,
                  mail_to: project.contact_email
                      ? `<a href='mailto:${project.contact_email}'>${project.contact_email}</a>`
                      : '',
                  correct_link: `<a href='${correctHref}'>${correctLinkTitle}</a>`,
              }
          )
        : '';
    const mailText = Array.isArray(mailParts) ? mailParts.join('') : mailParts;

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
                project.is_umbrella ? '' : '_project'
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
            validate: (v) => Boolean(v && v.length > 100),
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
                            [underscore(data.type)]: {
                                mail_text: mailText,
                                ...params[underscore(data.type)],
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
        type: PropTypes.string,
    }),
    dataPath: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    scope: PropTypes.string,
    responseLocale: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
};
