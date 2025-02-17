import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { getCurrentUser } from 'modules/data';
import { useProject } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';
import { useProjectAccessStatus } from './projectAccessStatus-hook';

export default function ActivationFlow({
    className,
}) {
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
                <span className="Flow-text">
                    Freischaltung im Archiv beantragen
                </span>
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
