import { getCurrentProject, getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { useSelector } from 'react-redux';

import CorrectUserDataFormContainer from './CorrectUserDataFormContainer';

export default function CorrectUserDataPopup({}) {
    const { t } = useI18n();
    const user = useSelector(getCurrentUser);
    const project = useSelector(getCurrentProject);

    const rejectedProjectAccess =
        user?.user_projects &&
        Object.values(user.user_projects).find((up) => {
            return (
                up.project_id === project?.id &&
                up.workflow_state === 'project_access_rejected'
            );
        });

    const fromLink = window.location.search.includes('correct_user_data');

    if (!(rejectedProjectAccess && fromLink)) return null;

    return (
        <Modal
            key="correct-user-data-popup"
            title={t('modules.project_access.correct_user_data_title')}
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            showDialogInitially={true}
            hideButton={true}
        >
            {(close) => (
                <CorrectUserDataFormContainer
                    onSubmit={close}
                    onCancel={close}
                    userProject={rejectedProjectAccess}
                />
            )}
        </Modal>
    );
}
