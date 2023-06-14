import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';
import { useI18n } from 'modules/i18n';
import { getCurrentProject, getCurrentUser, getUsersStatus } from 'modules/data';

export default function ProjectAccessAlert ({
    user,
    project,
    fetchData,
}) {

    const { t } = useI18n();

    if (project.grant_access_without_login) return null;
    if (!!user && project?.grant_project_access_instantly) return null;

    const currentUserProject = user?.user_projects &&
        Object.values(user.user_projects).find( up => {
            return up.project_id === project?.id
        });

    if (
        currentUserProject?.workflow_state === 'project_access_requested' ||
        currentUserProject?.workflow_state === 'project_access_data_corrected'
    ) {
        return <div className='error'>
                <p>{`${t('modules.project_access.request_in_process_text1')}`}</p>
                <p>{`${t('modules.project_access.request_in_process_text2')}`}</p>
            </div>
    } else if (currentUserProject?.workflow_state === 'project_access_rejected') {
        return <div className='error'>{`${t('modules.project_access.rejected_text')}`}</div>
    } else if (user.workflow_state === 'blocked' || currentUserProject?.workflow_state === 'project_access_blocked') {
        return <div className='error'>{`${t('modules.project_access.blocked_text')}`}</div>
    } else {
        return (
            <>
                <p className='error'>
                    {t('modules.project_access.request_access_explanation1')}
                </p>
                <p className='error'>
                    {t('modules.project_access.request_access_explanation2')}
                </p>
                <Modal
                    key='request-project-access-popup'
                    title={t('modules.project_access.request_access_link')}
                    triggerClassName='Button Button--fullWidth Button--secondaryAction u-mt-small u-mb-small'
                    trigger={t('modules.project_access.request_access_link')}
                >
                    {close => (
                        <RequestProjectAccessFormContainer
                            project={project}
                            onSubmit={close}
                            onCancel={close}
                        />
                    )}
                </Modal>
            </>
        )
    }
}
