import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

/**
 * Generic reusable button component with support for loading states, icons, and multiple variants.
 *
 * @component
 * @param {Object} props - Component props
 * @param {('submit'|'button'|'reset')} [props.type='button'] - HTML button type. 'submit': form submission, 'button': regular button, 'reset': reset form fields
 * @param {Function} [props.onClick] - Callback function when button is clicked
 * @param {ReactNode|string} [props.buttonText] - Button display text or element (uses i18n translation if not provided)
 * @param {string} [props.ariaLabel] - Aria label for accessibility (required for icon-only buttons)
 * @param {boolean} [props.isLoading] - Shows loading spinner and disables button when true
 * @param {string} [props.loadingText] - Text to display while loading (defaults to buttonText)
 * @param {boolean} [props.isDisabled] - Disables the button
 * @param {('text'|'outlined'|'contained')} [props.variant='outlined'] - Button style variant
 * @param {('primary'|'secondary'|'error'|'success')} [props.color='primary'] - Button color theme
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Button size
 * @param {boolean} [props.fullWidth] - Stretch button to full container width
 * @param {boolean} [props.isIconOnly] - Button displays only an icon (centers content)
 * @param {ReactNode} [props.startIcon] - Icon element displayed before button text
 * @param {ReactNode} [props.endIcon] - Icon element displayed after button text
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {Object} [props...] - All other standard HTML button attributes
 * @returns {ReactElement} The rendered button element
 */
export default function Button({
    type = 'button',
    onClick,
    buttonText,
    ariaLabel,
    isLoading,
    loadingText,
    isDisabled,
    variant = 'outlined',
    color = 'primary',
    size = 'md',
    fullWidth = false,
    isIconOnly = false,
    startIcon,
    endIcon,
    className,
    ...props
}) {
    const { t } = useI18n();

    const displayText =
        isLoading && loadingText ? loadingText : buttonText || t('submit');
    const finalAriaLabel = ariaLabel || (isIconOnly ? displayText : undefined);

    const buttonClass = classNames(
        'GenericButton',
        `GenericButton--${variant}`,
        `GenericButton--${color}`,
        `GenericButton--${size}`,
        {
            'GenericButton--fullWidth': fullWidth,
            'GenericButton--iconOnly': isIconOnly,
        },
        className
    );

    return (
        <button
            type={type}
            className={buttonClass}
            disabled={isDisabled || isLoading}
            onClick={onClick}
            aria-busy={isLoading}
            aria-label={finalAriaLabel}
            {...props}
        >
            {isLoading ? (
                <span className="LoadingSpinner" aria-hidden="true" />
            ) : (
                startIcon
            )}
            {!isIconOnly && displayText}
            {endIcon}
        </button>
    );
}

Button.propTypes = {
    type: PropTypes.oneOf(['submit', 'button', 'reset']),
    onClick: PropTypes.func,
    buttonText: PropTypes.node,
    ariaLabel: PropTypes.string,
    isLoading: PropTypes.bool,
    loadingText: PropTypes.string,
    isDisabled: PropTypes.bool,
    variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
    color: PropTypes.oneOf(['primary', 'secondary', 'error', 'success']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    fullWidth: PropTypes.bool,
    isIconOnly: PropTypes.bool,
    startIcon: PropTypes.node,
    endIcon: PropTypes.node,
    className: PropTypes.string,
};
