import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { ActivationFlow, useProjectAccessStatus } from 'modules/auth';
import { getCurrentUser } from 'modules/data';
import { useProject } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';
import LocaleButtons from './LocaleButtons';
import SessionButtons from './SessionButtons';
import ToggleEditView from './ToggleEditView';
import SidebarTabsContainer from './SidebarTabsContainer';
import CurrentArchive from './CurrentArchive';

export default function Sidebar({
    className,
}) {
    const isLoggedIn = useSelector(getIsLoggedIn);
    const user = useSelector(getCurrentUser);
    const { project, isOhd } = useProject();
    const { projectAccessGranted, projectAccessStatus } = useProjectAccessStatus(project);

    const showToggleEditViewButton = user
        && Object.keys(user).length > 0
        && (
            user.admin
                || Object.keys(user.tasks).length > 0
                || Object.keys(user.supervised_tasks).length > 0
                || Object.keys(user.permissions).length > 0
        );

    const showActivationFlow = !isOhd || !projectAccessGranted;

    let activationStep = 1;
    if (isLoggedIn) {
        activationStep = 2;
    }
    if (projectAccessStatus === 'project_access_requested') {
        activationStep = 3;
    }

    return (
        <div className={classNames(className, 'Sidebar', 'wrapper-flyout')}>
            <header className="Sidebar-header">
                <LocaleButtons />
                <SessionButtons className="u-ml" />
            </header>

            <div className="u-mb u-ml">
                <CurrentArchive className="Sidebar-title u-mt-none u-mb-none" />
                {showToggleEditViewButton && <ToggleEditView />}
            </div>

            {showActivationFlow && (
                <ActivationFlow active={activationStep} className="u-mr u-mb u-ml" />
            )}

            <SidebarTabsContainer />
        </div>
    );
}

Sidebar.propTypes = {
    className: PropTypes.string,
};
