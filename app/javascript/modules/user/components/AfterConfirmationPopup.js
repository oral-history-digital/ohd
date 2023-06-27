import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';
import { getCurrentUser, getCurrentProject } from 'modules/data';

export default function AfterConfirmationPopup ({
}) {
    const currentUser = useSelector(getCurrentUser);
    const currentProject = useSelector(getCurrentProject);

    const recentlyConfirmed = currentUser && new Date(currentUser.confirmed_at).getTime() + 60000 > Date.now() &&
        currentUser?.pre_register_location?.split('?')[0] === (location.origin + location.pathname) &&
        !currentProject.is_ohd;

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

