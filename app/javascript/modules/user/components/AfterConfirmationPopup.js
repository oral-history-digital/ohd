import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';
import { getCurrentUser, getCurrentProject } from 'modules/data';

export default function AfterConfirmationPopup ({
}) {
    const currentUser = useSelector(getCurrentUser);
    const currentProject = useSelector(getCurrentProject);
    const confirmed = currentUser && Date.parse(currentUser.confirmed_at);

    const recentlyConfirmed = currentUser?.confirmed_at + 60000 > Date.now() &&
        currentUser?.pre_registration_location === location.href &&
        !currentProject.is_ohd;

    if (!recentlyConfirmed) return null;

    return (
        <Modal
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            showDialogInitially={true}
            hideButton={true}
        >
            { close => (
                <RequestProjectAccessFormContainer
                    onSubmit={close}
                    onCancel={close}
                />
            )}
        </Modal>
    )
}

