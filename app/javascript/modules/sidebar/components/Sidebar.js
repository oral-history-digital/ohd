import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getIsLoggedIn } from 'modules/user';
import LocaleButtonsContainer from './LocaleButtonsContainer';
import ToggleEditView from './ToggleEditView';
import SidebarTabsContainer from './SidebarTabsContainer';
import CurrentArchive from './CurrentArchive';
import ProjectAccessBeforeLogin from './ProjectAccessBeforeLogin';
import ProjectAccessAfterLogin from './ProjectAccessAfterLogin';

export default function Sidebar({
    className,
}) {
    const loggedIn = useSelector(getIsLoggedIn);

    return (
        <div className={classNames(className, 'Sidebar', 'wrapper-flyout')}>
            <header className="Sidebar-header">
                <LocaleButtonsContainer />
                <ToggleEditView className="u-ml" />
            </header>
            <div className="u-mt-none u-mr u-mb u-ml">
                <CurrentArchive />
                {loggedIn ? (
                    <ProjectAccessAfterLogin />
                ) : (
                    <ProjectAccessBeforeLogin />
                )}
            </div>
            <SidebarTabsContainer />
        </div>
    );
}

Sidebar.propTypes = {
    className: PropTypes.string,
};
