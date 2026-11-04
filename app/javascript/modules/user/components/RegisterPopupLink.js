import { getProjectBrandName, useUmbrellaProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Modal } from 'modules/ui';

import RegisterForm from './RegisterForm';

/**
 * Opens registration with the access-request step label for individual projects.
 * @returns {React.ReactElement|null} Registration/access content when project settings are available.
 */
export default function RegisterPopupLink() {
    const { t, locale } = useI18n();
    const isOpen = /open_register_popup/.test(location.search);
    const { project: currentProject, isLoading, error } = useProject({});
    const { project: umbrellaProject } = useUmbrellaProject();

    if (!currentProject || isLoading || error) return null;
    const showStepOne = !currentProject.is_umbrella;
    const registrationTitleParts = t('modules.registration.title', {
        umbrella_project_name: getProjectBrandName(umbrellaProject, locale),
    });
    const registrationTitle = Array.isArray(registrationTitleParts)
        ? registrationTitleParts.join('')
        : registrationTitleParts;

    return (
        <>
            <Modal
                title={
                    showStepOne
                        ? [
                              t('modules.project_access.request_step_one'),
                              registrationTitle,
                          ]
                        : registrationTitle
                }
                triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
                trigger={t('user.registration')}
                showDialogInitially={isOpen}
            >
                {(close) => (
                    <RegisterForm
                        onSubmit={close}
                        onCancel={close}
                        showCancelButton={true}
                    />
                )}
            </Modal>
        </>
    );
}
