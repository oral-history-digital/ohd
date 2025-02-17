import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { useProjectAccessStatus } from 'modules/auth';
import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Modal } from 'modules/ui';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';
import { getIsLoggedIn } from '../selectors';

export default function ActivationFlow({
    className,
}) {
    const { t } = useI18n();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const user = useSelector(getCurrentUser);
    const { project, isOhd } = useProject();
    const { projectAccessGranted, projectAccessStatus } = useProjectAccessStatus(project);

    let showActivationFlow = true;

    if (project.grant_access_without_login) {
        showActivationFlow = false;
    } else if (isLoggedIn && project?.grant_project_access_instantly) {
        showActivationFlow = false;
    } else if (isOhd) {
        showActivationFlow = false;
    } else if (projectAccessGranted) {
        showActivationFlow = false;
    }

    if (!showActivationFlow) {
        return null;
    }

    let activationStep = 1;
    if (isLoggedIn) {
        activationStep = 2;
    }
    if (projectAccessStatus === 'project_access_requested') {
        activationStep = 3;
    }

    return (
        <ol className={classNames('Flow', className)}>
            <li className={classNames('Flow-item', {'Flow-item--active': activationStep == 1})}
                title={activationStep == 1 ? '' : 'In oh.d registrieren oder anmelden'}>
                <span className="Flow-text">
                    In oh.d registrieren oder anmelden
                </span>
            </li>
            <li className={classNames('Flow-item', {'Flow-item--active': activationStep == 2})}
                title={activationStep == 2 ? '' : 'Freischaltung im Archiv beantragen'}>
                <Modal
                    key='request-project-access-popup'
                    title={t('modules.project_access.request_access_link')}
                    triggerClassName='Flow-text Button Button--fullWidth Button--secondaryAction u-mt-small u-mb-small'
                    trigger="Freischaltung im Archiv beantragen"
                >
                    {close => (
                        <RequestProjectAccessFormContainer
                            project={project}
                            onSubmit={close}
                            onCancel={close}
                        />
                    )}
                </Modal>
            </li>
            <li className={classNames('Flow-item', {'Flow-item--active': activationStep == 3})}
                title={activationStep == 3 ? '' : 'Freischaltung im Archiv abwarten'}>
                <span className="Flow-text">
                    Freischaltung im Archiv abwarten
                </span>
            </li>
        </ol>
    );
}

ActivationFlow.propTypes = {
    className: PropTypes.string,
};
