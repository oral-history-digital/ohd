import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';
import { useI18n } from 'modules/i18n';
import { getCurrentProject, getCurrentUser } from 'modules/data';

export default function ProjectAccessAlert ({
}) {

    const user = useSelector(getCurrentUser);
    const project = useSelector(getCurrentProject);
    const { t } = useI18n();

    const unactivatedProject = user?.user_projects &&
        Object.values(user.user_projects).find( urp => {
            return urp.project_id === project?.id && urp.activated_at === null
        });

    if (unactivatedProject) {
        return <div className='error'>{`${t('project_access_in_process')}`}</div>
    } else {
        return (
            <>
                <p className='error'>
                    {t( 'request_project_access_explanation')}
                </p>
                <Modal
                    title={t( 'request_project_access_link')}
                    triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
                    trigger={t( 'request_project_access_link')}
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