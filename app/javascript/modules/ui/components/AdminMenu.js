import { cloneElement, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaTimes, FaEllipsisV } from 'react-icons/fa';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import VisuallyHidden from '@reach/visually-hidden';

import { useI18n } from 'modules/i18n';

/**
 * Usage:
 *
 * <AdminMenu>
 *   <AdminMenu.Item name=... label=...>
 *     ...content of dialog...
 *   </AdminMenu.Item>
 * </AdminMenu>
 *
 * AdminMenu can only have AdminMenu.Item components as children.
 */

export default function AdminMenu({
    className,
    children,
}) {
    const { t } = useI18n();
    const [openDialog, setOpenDialog] = useState(null);
    const closeDialog = () => setOpenDialog(null);

    if (!children) {
        return null;
    }

    const childrenArray = Array.isArray(children) ? children : [children];

    return (
        <>
            <Menu className={classNames(className)}>
                <MenuButton className="Button Button--transparent Button--icon">
                    <VisuallyHidden>
                        {t('modules.ui.admin_menu.actions')}
                    </VisuallyHidden>
                    <FaEllipsisV className="Icon Icon--small Icon--editorial" />
                </MenuButton>
                <MenuList>
                    {
                        childrenArray.map(child => (
                            <MenuItem
                                key={child.props.name}
                                className="ReachMenuItem"
                                onSelect={() => setOpenDialog(child.props.name)}
                            >
                                {child.props.label}
                            </MenuItem>
                        ))
                    }
                </MenuList>
            </Menu>

            {
                childrenArray.map(child => cloneElement(child, {
                    open: child.props.name === openDialog,
                    onClose: closeDialog,
                }))
            }
        </>
    );
}

AdminMenu.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};

function AdminMenuItem({
    label,
    dialogTitle,
    open,
    children,
    onClose,
}) {
    return (
        <Dialog
            isOpen={open}
            onDismiss={onClose}
            className="Modal-dialog"
        >
            <h3 className="Modal-heading">
                {dialogTitle || label}
            </h3>

            {
                typeof children === 'function' ?
                    children(onClose) :
                    children
            }

            <button className="Modal-close" onClick={onClose}>
                <VisuallyHidden>Close</VisuallyHidden>
                <FaTimes className="Modal-icon" />
            </button>
        </Dialog>
    );
}

AdminMenuItem.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    dialogTitle: PropTypes.string,
    open: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
    ]),
    onClose: PropTypes.func.isRequired,
};

AdminMenu.Item = AdminMenuItem;