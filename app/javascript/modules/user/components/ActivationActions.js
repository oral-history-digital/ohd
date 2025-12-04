import classNames from 'classnames';
import { useProjectAccessStatus } from 'modules/auth';
import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getIsLoggedIn } from '../selectors';
import CorrectUserDataFormContainer from './CorrectUserDataFormContainer';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';

export default function ActivationFlow({ className }) {
    const { t } = useI18n();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const user = useSelector(getCurrentUser);
    const { project, isOhd } = useProject();
    const { projectAccessGranted, projectAccessStatus } =
        useProjectAccessStatus(project);

    const currentUserProject =
        user?.user_projects &&
        Object.values(user.user_projects).find((up) => {
            return up.project_id === project?.id;
        });

    if (!user) {
        return null;
    } else if (project.grant_access_without_login) {
        return null;
    } else if (isLoggedIn && project?.grant_project_access_instantly) {
        return null;
    } else if (isOhd) {
        return null;
    } else if (
        projectAccessStatus === 'project_access_requested' ||
        projectAccessStatus === 'project_access_data_corrected'
    ) {
        return null;
    } else if (projectAccessGranted) {
        return null;
    } else if (projectAccessStatus === 'project_access_rejected') {
        return (
            <div className={classNames(className)}>
                <p className="error">
                    {`${t('modules.project_access.rejected_text')}`}
                </p>
                <Modal
                    title={t('modules.project_access.rejected_button_text')}
                    triggerClassName="Button Button--fullWidth Button--secondaryAction u-mt-small u-mb-small"
                    trigger={t('modules.project_access.rejected_button_text')}
                >
                    {(close) => (
                        <CorrectUserDataFormContainer
                            onSubmit={close}
                            onCancel={close}
                            userProject={currentUserProject}
                        />
                    )}
                </Modal>
            </div>
        );
    } else if (
        user.workflow_state === 'blocked' ||
        currentUserProject?.workflow_state === 'project_access_blocked'
    ) {
        return (
            <div className={classNames(className, 'error')}>
                {`${t('modules.project_access.blocked_text')}`}
            </div>
        );
    } else {
        return (
            <div className={classNames(className)}>
                <Modal
                    title={t('modules.project_access.request_access_link')}
                    triggerClassName="Button Button--secondaryAction"
                    trigger={t('modules.project_access.request_access_link')}
                >
                    {(close) => (
                        <RequestProjectAccessFormContainer
                            project={project}
                            onSubmit={close}
                            onCancel={close}
                        />
                    )}
                </Modal>
            </div>
        );
    }
}

ActivationFlow.propTypes = {
    className: PropTypes.string,
};
