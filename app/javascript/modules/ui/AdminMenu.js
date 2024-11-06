import { cloneElement, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaTimes, FaEllipsisH } from 'react-icons/fa';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import { VisuallyHidden } from '@reach/visually-hidden';

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
    disabled = false,
    children,
}) {
    const { t } = useI18n();
    const [openDialog, setOpenDialog] = useState(null);
    const closeDialog = () => setOpenDialog(null);

    if (!children) {
        return null;
    }

    const childrenArray = Array.isArray(children) ? children : [children];
    const cleanedChildrenArray = childrenArray.filter(c => c && c.props);

    return (
        <>
            <Menu className={classNames(className)}>
                <MenuButton
                    className="Button Button--transparent Button--icon Button--editorial"
                    disabled={disabled}
                >
                    <VisuallyHidden>
                        {t('modules.ui.admin_menu.actions')}
                    </VisuallyHidden>
                    <FaEllipsisH className="Icon Icon--small Icon--editorial" />
                </MenuButton>
                <MenuList>
                    {
                        cleanedChildrenArray.map(child => (
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
                cleanedChildrenArray.map(child => cloneElement(child, {
                    open: child.props.name === openDialog,
                    onClose: closeDialog,
                    key: child.props.name,
                }))
            }
        </>
    );
}

AdminMenu.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
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

            {typeof children === 'function' ?
                children(onClose) :
                children
            }

            <button
                type="button"
                className="Modal-close"
                onClick={onClose}
            >
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
    onClose: PropTypes.func,
};

AdminMenu.Item = AdminMenuItem;
