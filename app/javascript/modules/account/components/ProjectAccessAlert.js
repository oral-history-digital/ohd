import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';
import { useI18n } from 'modules/i18n';
import { getCurrentProject, getCurrentAccount } from 'modules/data';

export default function ProjectAccessAlert ({
}) {

    const account = useSelector(getCurrentAccount);
    const project = useSelector(getCurrentProject);
    const { t } = useI18n();

    const unactivatedProject = account?.user_registration_projects &&
        Object.values(account.user_registration_projects).find( urp => {
            urp.project_id === project?.id && urp.activated_at === null
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