import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import UserForm from './UserForm';

/**
 * Chooses the notification language from the recipient's preference and current project settings.
 *
 * @param {Object} props - User editor inputs forwarded to the form.
 * @param {Object} props.data - Account or project-access record, including the preferred language.
 * @returns {React.ReactElement} User form, loading indicator, or project request error.
 */
export default function UserFormContainer({ data, ...props }) {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({});
    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
            />
        );
    if (isLoading || !project) return <Spinner />;

    // Keep the existing rule: use the recipient's language only when the project enables it.
    const responseLocale = project.available_locales.includes(
        data.default_locale
    )
        ? data.default_locale
        : project.default_locale;
    return <UserForm {...props} data={data} responseLocale={responseLocale} />;
}

UserFormContainer.propTypes = {
    data: PropTypes.object.isRequired,
};
