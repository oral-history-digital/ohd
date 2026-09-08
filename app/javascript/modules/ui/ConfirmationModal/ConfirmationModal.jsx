import PropTypes from 'prop-types';

import { Button, CancelButton } from '../Buttons';
import Modal from '../Modal';

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    children,
    confirmText,
    cancelText,
    confirmColor = 'primary',
    isLoading = false,
    onConfirm,
    onCancel,
    className,
    hideCloseButton = true,
}) {
    if (!isOpen) return null;

    return (
        <Modal
            className={className}
            title={title}
            trigger={<span />}
            hideButton
            hideCloseButton={hideCloseButton}
            showDialogInitially
            onClose={onCancel}
        >
            <div>
                {message && <p>{message}</p>}
                {children}
                <div className="Form-footer u-mt">
                    <div className="Form-footer-buttons">
                        <CancelButton
                            buttonText={cancelText}
                            handleCancel={onCancel}
                            isDisabled={isLoading}
                        />
                        <Button
                            variant="contained"
                            color={confirmColor}
                            buttonText={confirmText}
                            isLoading={isLoading}
                            onClick={onConfirm}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.node.isRequired,
    message: PropTypes.node,
    children: PropTypes.node,
    confirmText: PropTypes.node,
    cancelText: PropTypes.string,
    confirmColor: PropTypes.oneOf(['primary', 'secondary', 'error', 'success']),
    isLoading: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    className: PropTypes.string,
    hideCloseButton: PropTypes.bool,
};
