import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

import Button from './Button';

/**
 * Cancel button component - a convenience wrapper for Button with type="button" and outlined variant.
 * Defaults to displaying the "Cancel" translation with an X icon.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.handleCancel - Required callback function when button is clicked
 * @param {string} [props.buttonText] - Button display text (defaults to 'cancel' translation)
 * @param {string} [props.ariaLabel] - Aria label for accessibility (required for icon-only)
 * @param {string} [props.loadingText] - Text displayed while loading
 * @param {('text'|'outlined'|'contained')} [props.variant='outlined'] - Button style variant
 * @param {('primary'|'secondary'|'error'|'success')} [props.color='primary'] - Button color theme
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Button size
 * @param {boolean} [props.fullWidth] - Stretch button to full container width
 * @param {boolean} [props.isIconOnly] - Button displays only an icon
 * @param {boolean} [props.isLoading] - Shows loading spinner and disables button when true
 * @param {boolean} [props.isDisabled] - Disables the button
 * @param {ReactNode} [props.startIcon] - Icon element displayed before button text
 * @param {ReactNode} [props.endIcon] - Icon element displayed after button text
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {ReactElement} The rendered button element
 */
export default function CancelButton({
    handleCancel,
    buttonText,
    ariaLabel,
    loadingText,
    variant = 'outlined',
    color = 'primary',
    size = 'md',
    fullWidth = false,
    isIconOnly = false,
    startIcon = <FaTimes className="Icon" />,
    ...props
}) {
    const { t } = useI18n();

    return (
        <Button
            type="button"
            variant={variant}
            color={color}
            size={size}
            fullWidth={fullWidth}
            isIconOnly={isIconOnly}
            onClick={handleCancel}
            buttonText={buttonText || t('cancel')}
            ariaLabel={ariaLabel}
            loadingText={loadingText}
            startIcon={startIcon}
            {...props}
        />
    );
}

CancelButton.propTypes = {
    handleCancel: PropTypes.func.isRequired,
    buttonText: PropTypes.string,
    ariaLabel: PropTypes.string,
    loadingText: PropTypes.string,
    variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
    color: PropTypes.oneOf(['primary', 'secondary', 'error', 'success']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    fullWidth: PropTypes.bool,
    isIconOnly: PropTypes.bool,
    isLoading: PropTypes.bool,
    isDisabled: PropTypes.bool,
    startIcon: PropTypes.node,
    endIcon: PropTypes.node,
    className: PropTypes.string,
};
