import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getCurrentProject, getCurrentUser } from 'modules/data';

export default function AfterRequestProjectAccessPopup ({
}) {
    const user = useSelector(getCurrentUser);
    const project = useSelector(getCurrentProject);
    const { t } = useI18n();

    const recentlyRequestedProjectAccess = user?.user_projects &&
        Object.values(user.user_projects).find( urp => {
            return urp.project_id === project?.id && urp.created_at + 5000 > Date.now();
        });

    if (!recentlyRequestedProjectAccess) return null;

    return (
        <Modal
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            title={t('modules.request_project_access.in_process_title')}
            showDialogInitially={true}
            hideButton={true}
        >
                    <>
                        <p>
                            {t('modules.request_project_access.in_process_text')}
                        </p>
                    </>
        </Modal>
    )
}

