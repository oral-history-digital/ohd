import {
    getCurrentProject,
    getProjectBrandName,
    getUmbrellaProject,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { useSelector } from 'react-redux';

import RegisterForm from './RegisterForm';

export default function RegisterPopupLink() {
    const { t, locale } = useI18n();
    const isOpen = /open_register_popup/.test(location.search);
    const currentProject = useSelector(getCurrentProject);
    const umbrellaProject = useSelector(getUmbrellaProject);

    if (!currentProject) return null;
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
