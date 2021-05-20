import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

import styles from './Modal.module.scss';

export default function Modal({
    title,
    className,
    triggerClassName,
    trigger = <i className="fa fa-ellipsis-h" />,
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
                className={classNames(styles.trigger, triggerClassName)}
                title={title}
                onClick={open}
            >
                {trigger}
            </button>

            <Dialog
                className={classNames(styles.dialog, className)}
                isOpen={showDialog}
                aria-label={title}
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
                <h3 className={styles.heading}>{title}</h3>

                {
                    typeof children === 'function' ?
                        children(close) :
                        children
                }

                <button className={styles.close} onClick={close}>
                    <i className="fa fa-close" aria-hidden />
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
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
    ]),
};
