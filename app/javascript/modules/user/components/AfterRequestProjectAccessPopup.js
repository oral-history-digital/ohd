import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getCurrentProject, getCurrentUser } from 'modules/data';

export default function AfterRequestProjectAccessPopup({}) {
    const user = useSelector(getCurrentUser);
    const project = useSelector(getCurrentProject);
    const { t } = useI18n();

    const recentlyRequestedProjectAccess =
        user?.user_projects &&
        Object.values(user.user_projects).find((urp) => {
            return (
                urp.project_id === project?.id &&
                urp.workflow_state === 'project_access_requested' &&
                new Date(urp.updated_at).getTime() + 60000 > Date.now()
            );
        });

    if (!recentlyRequestedProjectAccess) return null;

    return (
        <Modal
            key="after-request-project-access-popup"
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            title={t('modules.project_access.request_in_process_title')}
            showDialogInitially={true}
            hideButton={true}
        >
            {(close) => (
                <>
                    <p>{`${t('modules.project_access.request_in_process_text')}`}</p>
                    <input
                        type="button"
                        className="Button Button--primaryAction"
                        value={'OK'}
                        onClick={close}
                    />
                </>
            )}
        </Modal>
    );
}
