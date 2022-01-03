import classNames from 'classnames';
import PropTypes from 'prop-types';

import LocaleButtonsContainer from './LocaleButtonsContainer';
import SidebarTabsContainer from './SidebarTabsContainer';

export default function Sidebar({
    className,
}) {
    return (
        <div className={classNames(className, 'Sidebar', 'wrapper-flyout')}>
            <LocaleButtonsContainer />
            <SidebarTabsContainer />
        </div>
    );
}

Sidebar.propTypes = {
    className: PropTypes.string,
};
