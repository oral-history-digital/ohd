import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import RegisterFormContainer from './RegisterFormContainer';
import { getCurrentProject } from 'modules/data';

export default function RegisterPopupLink ({
}) {
    const { t } = useI18n();
    const isOpen = /open_register_popup/.test(location.search);
    const currentProject = useSelector(getCurrentProject);
    const showStepOne = !currentProject.is_ohd;

    return (
        <>
            <Modal
                title={(showStepOne ? t('modules.project_access.request_step_one') : '') + t('modules.registration.title')}
                triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
                trigger={t('user.registration')}
                showDialogInitially={isOpen}
            >
                {close => (
                    <RegisterFormContainer
                        onSubmit={close}
                        onCancel={close}
                    />
                )}
            </Modal>
        </>
    )
}
