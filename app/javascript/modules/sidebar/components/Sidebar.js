import classNames from 'classnames';
import { getCurrentUser } from 'modules/data';
import {
    ActivationActions,
    ActivationFlow,
    canUseEditView,
} from 'modules/user';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import CurrentArchive from './CurrentArchive';
import LocaleButtons from './LocaleButtons';
import SessionButtons from './SessionButtons';
import SidebarTabsContainer from './SidebarTabsContainer';
import ToggleEditView from './ToggleEditView';

export default function Sidebar({ className }) {
    const user = useSelector(getCurrentUser);
    const showToggleEditViewButton = canUseEditView(user);

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

            <ActivationActions className="u-mr u-mb u-ml" />

            <SidebarTabsContainer />
        </div>
    );
}

Sidebar.propTypes = {
    className: PropTypes.string,
};
