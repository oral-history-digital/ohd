import classNames from 'classnames';
import PropTypes from 'prop-types';

import LocaleButtonsContainer from './LocaleButtonsContainer';
import ToggleEditView from './ToggleEditView';
import SidebarTabsContainer from './SidebarTabsContainer';

export default function Sidebar({
    className,
}) {
    return (
        <div className={classNames(className, 'Sidebar', 'wrapper-flyout')}>
            <div className="Sidebar--header">
                <LocaleButtonsContainer />
                <ToggleEditView className="u-ml" />
            </div>
            <SidebarTabsContainer />
        </div>
    );
}

Sidebar.propTypes = {
    className: PropTypes.string,
};
