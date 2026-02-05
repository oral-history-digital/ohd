import { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import {
    FaCheck,
    FaCheckCircle,
    FaChevronDown,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimes,
    FaTimesCircle,
} from 'react-icons/fa';

import { Button, CancelButton } from '../Buttons';

const ICON_MAP = {
    success: FaCheckCircle,
    warning: FaExclamationTriangle,
    error: FaTimesCircle,
    info: FaInfoCircle,
};

/**
 * Generic inline notification component with support for multiple states, actions, and auto-dismiss.
 *
 * @component
 * @param {Object} props - Component props
 * @param {('success'|'warning'|'error'|'info')} props.variant - Notification type/state
 * @param {string} [props.title] - Notification title (bold heading)
 * @param {string} [props.description] - Main notification message
 * @param {string|ReactNode} [props.additionalInfo] - Additional collapsible content
 * @param {boolean} [props.isAdditionalInfoOpen] - Controlled state for additional info collapse
 * @param {Function} [props.onAdditionalInfoToggle] - Callback when additional info is toggled
 * @param {boolean} [props.isClosable=true] - Whether to show close button
 * @param {Function} [props.onClose] - Callback when notification is closed
 * @param {number} [props.autoHideDuration] - Auto-hide timeout in milliseconds
 * @param {Function} [props.onAutoHide] - Callback when notification auto-hides
 * @param {Object} [props.actions] - Action buttons configuration
 * @param {Object} [props.actions.cancel] - Cancel button config { label, onClick }
 * @param {Object} [props.actions.submit] - Submit button config { label, onClick }
 * @param {('alert'|'status')} [props.role='alert'] - ARIA role for accessibility
 * @param {string} [props.className] - Additional CSS classes
 * @returns {ReactElement|null} The rendered notification element
 */
export function InlineNotification({
    variant = 'info',
    title,
    description,
    additionalInfo,
    isAdditionalInfoOpen,
    onAdditionalInfoToggle,
    isClosable = true,
    onClose,
    autoHideDuration,
    onAutoHide,
    actions,
    role = 'alert',
    className,
}) {
    const { t } = useI18n();
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [isInfoExpanded, setIsInfoExpanded] = useState(
        isAdditionalInfoOpen ?? false
    );
    const timeoutRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    // Handle controlled vs uncontrolled additional info state
    const isInfoOpen =
        isAdditionalInfoOpen !== undefined
            ? isAdditionalInfoOpen
            : isInfoExpanded;

    const handleInfoToggle = () => {
        const newState = !isInfoOpen;
        if (onAdditionalInfoToggle) {
            onAdditionalInfoToggle(newState);
        } else {
            setIsInfoExpanded(newState);
        }
    };

    const handleClose = useCallback(() => {
        // Start closing animation
        setIsClosing(true);

        // Wait for animation to complete before hiding
        closeTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            if (onAutoHide && autoHideDuration) {
                onAutoHide();
            }
            if (onClose) {
                onClose();
            }
        }, 300); // Match CSS transition duration
    }, [onAutoHide, autoHideDuration, onClose]);

    // Auto-hide functionality
    useEffect(() => {
        if (autoHideDuration && autoHideDuration > 0) {
            timeoutRef.current = setTimeout(() => {
                handleClose();
            }, autoHideDuration);

            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        }
    }, [autoHideDuration, handleClose]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isClosable && isVisible) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isClosable, isVisible, handleClose]);

    if (!isVisible) {
        return null;
    }

    const IconComponent = ICON_MAP[variant];
    const hasAdditionalInfo = Boolean(additionalInfo);
    const hasActions = Boolean(actions?.cancel || actions?.submit);

    const notificationClass = classNames(
        'InlineNotification',
        `InlineNotification--${variant}`,
        {
            'InlineNotification--closing': isClosing,
        },
        className
    );

    const ariaLive = autoHideDuration ? 'polite' : 'assertive';

    return (
        <div
            className={notificationClass}
            role={role}
            aria-live={ariaLive}
            aria-atomic="true"
        >
            <div className="InlineNotification__container">
                <div className="InlineNotification__icon" aria-hidden="true">
                    <IconComponent />
                </div>

                <div className="InlineNotification__content">
                    <div className="InlineNotification__header">
                        {title && (
                            <div className="InlineNotification__title">
                                {title}
                            </div>
                        )}

                        {isClosable && (
                            <button
                                type="button"
                                className="InlineNotification__closeButton"
                                onClick={handleClose}
                                aria-label={t('inline_notification.close')}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    {description && (
                        <div className="InlineNotification__description">
                            {description}
                        </div>
                    )}

                    {hasAdditionalInfo && (
                        <div className="InlineNotification__additionalInfoWrapper">
                            <button
                                type="button"
                                className="InlineNotification__additionalInfoToggle"
                                onClick={handleInfoToggle}
                                aria-expanded={isInfoOpen}
                            >
                                <FaChevronDown
                                    className={classNames(
                                        'InlineNotification__chevron',
                                        {
                                            'InlineNotification__chevron--rotated':
                                                isInfoOpen,
                                        }
                                    )}
                                />
                                {isInfoOpen
                                    ? t('inline_notification.show_less')
                                    : t('inline_notification.show_more')}
                            </button>

                            {isInfoOpen && (
                                <div className="InlineNotification__additionalInfo">
                                    {additionalInfo}
                                </div>
                            )}
                        </div>
                    )}

                    {hasActions && (
                        <div className="InlineNotification__actions">
                            {actions.cancel && (
                                <CancelButton
                                    handleCancel={actions.cancel.onClick}
                                    buttonText={
                                        actions.cancel.label ||
                                        t('inline_notification.cancel')
                                    }
                                    size="sm"
                                />
                            )}
                            {actions.submit && (
                                <Button
                                    type="button"
                                    onClick={actions.submit.onClick}
                                    buttonText={
                                        actions.submit.label ||
                                        t('inline_notification.submit')
                                    }
                                    variant="contained"
                                    size="sm"
                                    startIcon={<FaCheck className="Icon" />}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

InlineNotification.propTypes = {
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info'])
        .isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    additionalInfo: PropTypes.node,
    isAdditionalInfoOpen: PropTypes.bool,
    onAdditionalInfoToggle: PropTypes.func,
    isClosable: PropTypes.bool,
    onClose: PropTypes.func,
    autoHideDuration: PropTypes.number,
    onAutoHide: PropTypes.func,
    actions: PropTypes.shape({
        cancel: PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func.isRequired,
        }),
        submit: PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func.isRequired,
        }),
    }),
    role: PropTypes.oneOf(['alert', 'status']),
    className: PropTypes.string,
};

export default InlineNotification;
