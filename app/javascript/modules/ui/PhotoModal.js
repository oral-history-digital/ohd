import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import classNames from 'classnames';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

export default function PhotoModal({
    title,
    className,
    triggerClassName,
    trigger,
    children,
}) {
    const [showDialog, setShowDialog] = useState(false);
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    // Stop some events here so that they don't influence elements below the modal.
    const handleClick = (event) => {
        event.stopPropagation();
    };

    return (
        <>
            <button
                type="button"
                className={classNames('PhotoModal-trigger', triggerClassName)}
                title={title}
                onClick={open}
            >
                {trigger}
            </button>

            <Dialog
                className={classNames('PhotoModal-dialog', className)}
                isOpen={showDialog}
                aria-label={title || 'n/a'}
                onDismiss={close}
                onMouseDown={handleClick}
                onMouseUp={handleClick}
                onMouseMove={handleClick}
                onMouseLeave={handleClick}
                onTouchStart={handleClick}
                onTouchEnd={handleClick}
                onTouchMove={handleClick}
                onTouchCancel={handleClick}
            >
                {children}
                <button
                    type="button"
                    className="PhotoModal-close"
                    onClick={close}
                >
                    <FaTimes className="PhotoModal-icon" />
                </button>
            </Dialog>
        </>
    );
}

PhotoModal.propTypes = {
    trigger: PropTypes.node.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
    triggerClassName: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
