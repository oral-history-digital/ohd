import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaEllipsisH } from 'react-icons/fa';
import classNames from 'classnames';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

export default function Modal({
    title,
    className,
    triggerClassName,
    trigger = <FaEllipsisH className="Icon Icon--primary" />,
    disabled = false,
    children,
}) {
    const [showDialog, setShowDialog] = useState(false);
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    // Stop some events here so that they don't influence elements below the modal.
    const handleClick = (event) => {
        event.stopPropagation();
    };

    const dismiss = (event) => {
        // Close if escape key was pressed, not if user clicked outside.
        if (event.type === 'keydown') {
            close();
        }
    };

    return (
        <>
            <button
                type="button"
                className={classNames('Modal-trigger', triggerClassName)}
                title={title}
                onClick={open}
                disabled={disabled}
            >
                {trigger}
            </button>

            <Dialog
                className={classNames('Modal-dialog', className)}
                isOpen={showDialog}
                aria-label={title}
                onDismiss={dismiss}
                onMouseDown={handleClick}
                onMouseUp={handleClick}
                onMouseMove={handleClick}
                onMouseLeave={handleClick}
                onTouchStart={handleClick}
                onTouchEnd={handleClick}
                onTouchMove={handleClick}
                onTouchCancel={handleClick}
            >
                <h3 className="Modal-heading">{title}</h3>

                {
                    typeof children === 'function' ?
                        children(close) :
                        children
                }

                <button
                    type="button"
                    className="Modal-close"
                    onClick={close}
                >
                    <FaTimes className="Modal-icon" />
                </button>
            </Dialog>
        </>
    );
}

Modal.propTypes = {
    trigger: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    triggerClassName: PropTypes.string,
    disabled: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
    ]),
};
