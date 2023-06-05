import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getCurrentProject, getCurrentUser } from 'modules/data';
import { RequestProjectAccessFormContainer } from 'modules/user';
import { LockRegular, LockSolid } from 'modules/icon';

export default function ProjectAccessAfterLogin({
    className,
}) {
    const user = useSelector(getCurrentUser);
    const project = useSelector(getCurrentProject);
    const { t } = useI18n();

    if (project?.grant_project_access_instantly || user.admin) {
        return null;
    }

    const currentUserProject = user?.user_projects &&
        Object.values(user.user_projects).find( up => {
            return up.project_id === project?.id
        });

    if (
        currentUserProject?.workflow_state === 'project_access_requested' ||
        currentUserProject?.workflow_state === 'project_access_data_corrected'
    ) {
        return (<div>
            <p>
                <LockRegular className="Icon Icon--inlineSvg" />
                {' '}
                {`${t('modules.project_access.request_in_process_text1')}`}
            </p>
            <p>{`${t('modules.project_access.request_in_process_text2')}`}</p>
        </div>);
    } else if (currentUserProject?.workflow_state === 'project_access_rejected') {
        return <div className='error'>{`${t('modules.project_access.rejected_text')}`}</div>
    } else if (user.workflow_state === 'blocked' || currentUserProject?.workflow_state === 'project_access_blocked') {
        return <div className='error'>{`${t('modules.project_access.blocked_text')}`}</div>
    } else {
        return (
            <div className={classNames(className)}>
                <p>
                    <LockSolid className="Icon Icon--inlineSvg" />
                    {' '}
                    {t('modules.project_access.request_access_explanation')}
                </p>
                <Modal
                    key='request-project-access-popup'
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
            </div>
        )
    }
}

ProjectAccessAfterLogin.propTypes = {
    className: PropTypes.string,
};
