import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';
import { getCurrentUser, getCurrentProject } from 'modules/data';

export default function AfterConfirmationPopup ({
}) {
    const currentUser = useSelector(getCurrentUser);
    const currentProject = useSelector(getCurrentProject);
    const currentProjectAccess = currentUser?.user_projects &&
        Object.values(currentUser.user_projects).find( up => {
            return up.project_id === currentProject?.id;
        });

    const recentlyConfirmed = !currentProjectAccess?.tos_agreement &&
        currentUser?.pre_register_location?.split('?')[0] === (location.origin + location.pathname) &&
        !currentProject.is_ohd &&
        !currentProject.grant_project_access_instantly &&
        !currentProject.grant_access_without_login;

    if (!recentlyConfirmed) return null;

    return (
        <Modal
            key='after-confirmation-popup'
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            showDialogInitially={true}
            hideButton={true}
        >
            { close => (
                <RequestProjectAccessFormContainer
                    onSubmit={close}
                    onCancel={close}
                    showStepTwo
                />
            )}
        </Modal>
    )
}

