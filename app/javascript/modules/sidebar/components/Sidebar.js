import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { ActivationFlow } from 'modules/auth';
import { getCurrentUser } from 'modules/data';
import LocaleButtons from './LocaleButtons';
import SessionButtons from './SessionButtons';
import ToggleEditView from './ToggleEditView';
import SidebarTabsContainer from './SidebarTabsContainer';
import CurrentArchive from './CurrentArchive';

export default function Sidebar({
    className,
}) {
    const user = useSelector(getCurrentUser);

    const showToggleEditViewButton = user
        && Object.keys(user).length > 0
        && (
            user.admin
                || Object.keys(user.tasks).length > 0
                || Object.keys(user.supervised_tasks).length > 0
                || Object.keys(user.permissions).length > 0
        );

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

            <ActivationFlow className="u-mr u-mb u-ml" />

            <SidebarTabsContainer />
        </div>
    );
}

Sidebar.propTypes = {
    className: PropTypes.string,
};
