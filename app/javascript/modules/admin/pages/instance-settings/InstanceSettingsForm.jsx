import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export default function InstanceSettingsForm({
    instanceSettings,
    isSubmitting,
    notification,
    onDismissNotification,
    onSubmit,
    projects,
}) {
    const { locale, t } = useI18n();

    // Build display names for the project options
    const projectOptions = projects.map((project) => {
        const names = project.name || {};
        const name =
            (typeof names === 'string' && names) ||
            names[locale] ||
            names[project.default_locale] ||
            Object.values(names).find(Boolean) ||
            project.shortname;

        return {
            id: project.id,
            name: `${name} (${project.shortname})`,
        };
    });

    const elements = [
        {
            attribute: 'umbrella_project_id',
            elementType: 'select',
            labelKey: 'edit.instance.umbrella_project_id',
            help: 'edit.instance.umbrella_project_help',
            values: projectOptions,
        },
    ];

    return (
        <Form
            data={instanceSettings}
            values={{
                umbrella_project_id: String(
                    instanceSettings.umbrella_project_id
                ),
            }}
            scope="homepage_setting"
            submitText="submit"
            elements={elements}
            fetching={isSubmitting}
            notification={notification}
            onDismissNotification={onDismissNotification}
            onSubmit={onSubmit}
            disableIfUnchanged
            submitConfirmation={{
                title: t('edit.instance.umbrella_project_confirm.title'),
                message: t('edit.instance.umbrella_project_confirm.warning'),
                confirmText: t('edit.instance.umbrella_project_confirm.submit'),
            }}
        />
    );
}

InstanceSettingsForm.propTypes = {
    instanceSettings: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool,
    notification: PropTypes.object,
    onDismissNotification: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
};
