import classNames from 'classnames';
import { useProjectAccessStatus } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getIsLoggedIn } from '../selectors';

export default function ActivationFlow({ className }) {
    const isLoggedIn = useSelector(getIsLoggedIn);
    const { t } = useI18n();
    const { project, isOhd } = useProject();
    const { projectAccessGranted, projectAccessStatus } =
        useProjectAccessStatus(project);

    let showActivationFlow = true;

    if (project.grant_access_without_login) {
        showActivationFlow = false;
    } else if (isLoggedIn && project?.grant_project_access_instantly) {
        showActivationFlow = false;
    } else if (isOhd) {
        showActivationFlow = false;
    } else if (projectAccessGranted) {
        showActivationFlow = false;
    } else if (
        projectAccessStatus === 'project_access_blocked' ||
        projectAccessStatus === 'project_access_rejected'
    ) {
        showActivationFlow = false;
    }

    if (!showActivationFlow) {
        return null;
    }

    let activationStep = 1;
    if (isLoggedIn) {
        activationStep = 2;
    }
    if (
        projectAccessStatus === 'project_access_requested' ||
        projectAccessStatus === 'project_access_data_corrected'
    ) {
        activationStep = 3;
    }

    return (
        <ol className={classNames('Flow', className)}>
            <li
                className={classNames('Flow-item', {
                    'Flow-item--active': activationStep == 1,
                })}
                title={
                    activationStep == 1
                        ? ''
                        : t('modules.project_access.sign_in')
                }
            >
                <span className="Flow-text">
                    {t('modules.project_access.sign_in')}
                </span>
            </li>
            <li
                className={classNames('Flow-item', {
                    'Flow-item--active': activationStep == 2,
                })}
                title={
                    activationStep == 2
                        ? ''
                        : t('modules.project_access.request_access_link')
                }
            >
                <span className="Flow-text">
                    {t('modules.project_access.request_access_link')}
                </span>
            </li>
            <li
                className={classNames('Flow-item', {
                    'Flow-item--active': activationStep == 3,
                })}
                title={
                    activationStep == 3
                        ? ''
                        : t('modules.project_access.wait_for_access')
                }
            >
                <span className="Flow-text">
                    {t('modules.project_access.wait_for_access')}
                </span>
            </li>
        </ol>
    );
}

ActivationFlow.propTypes = {
    className: PropTypes.string,
};
