import classNames from 'classnames';
import PropTypes from 'prop-types';

import LocaleButtons from './LocaleButtons';
import ToggleEditView from './ToggleEditView';
import SidebarTabsContainer from './SidebarTabsContainer';
import CurrentArchive from './CurrentArchive';

export default function Sidebar({
    className,
}) {
    return (
        <div className={classNames(className, 'Sidebar', 'wrapper-flyout')}>
            <header className="Sidebar-header">
                <LocaleButtons />
                <ToggleEditView className="u-ml" />
            </header>
            <CurrentArchive className="Sidebar-title u-mt-none u-mb u-ml" />
            <SidebarTabsContainer />
        </div>
    );
}

Sidebar.propTypes = {
    className: PropTypes.string,
};
