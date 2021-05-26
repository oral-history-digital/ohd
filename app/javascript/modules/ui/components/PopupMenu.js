import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import styles from './PopupMenu.module.scss';

function PopupMenu({ className, children }) {
    const { t } = useI18n();

    const trigger = (
        <button
            className={styles.trigger}
            title={t('more')}
        >
            <i className={classNames(styles.triggerIcon, 'fa', 'fa-ellipsis-v')} />
        </button>
    );

    return (
        <Popup
            className={className}
            trigger={trigger}
            on={['click']}
            contentStyle={{ zIndex:1001 }}
            position={['right top', 'center top', 'left top']}
        >
            <ul className={styles.list}>
                {children}
            </ul>
        </Popup>
    );
}

const PopupMenuItem = ({ children }) => (
    <li>
        {children}
    </li>
);

PopupMenu.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

PopupMenuItem.propTypes = {
    children: PropTypes.element.isRequired
};

PopupMenu.Item = PopupMenuItem;

export default PopupMenu;
