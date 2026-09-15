import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export default function InstanceSettingsForm({
    instanceSettings,
    isSubmitting,
    notification,
    onDismissNotification,
    onSubmit,
}) {
    const { t } = useI18n();

    const elements = [
        {
            attribute: 'umbrella_project_id',
            type: 'number',
            labelKey: 'edit.instance.umbrella_project_id',
            help: t('edit.instance.umbrella_project_help'),
        },
    ];

    return (
        <Form
            data={instanceSettings}
            values={{
                umbrella_project_id: instanceSettings?.umbrella_project_id,
            }}
            scope="homepage_setting"
            submitText="submit"
            elements={elements}
            fetching={isSubmitting}
            notification={notification}
            onDismissNotification={onDismissNotification}
            onSubmit={onSubmit}
        />
    );
}

InstanceSettingsForm.propTypes = {
    instanceSettings: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool,
    notification: PropTypes.object,
    onDismissNotification: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
