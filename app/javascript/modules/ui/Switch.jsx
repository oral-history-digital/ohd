import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';

/**
 * Displays a controlled, labeled switch using the project's primary color when on.
 *
 * @param {Object} props - Switch properties.
 * @param {boolean} props.checked - Whether the switch is on.
 * @param {function(boolean): void} props.onChange - Receives the requested state.
 * @param {React.ReactNode} props.label - Visible, accessible switch label.
 * @param {string} [props.color='var(--primary-color)'] - CSS color for the enabled icon.
 * @param {('sm'|'md'|'lg')} [props.size='md'] - Label and icon size; md preserves the standard size.
 * @param {boolean} [props.disabled=false] - Prevents interaction when true.
 * @param {string} [props.className] - Additional button classes.
 * @param {Object} props... - Additional HTML button attributes, such as title and data attributes.
 * @returns {React.ReactElement} Keyboard-accessible switch button.
 */
export default function Switch({
    checked,
    onChange,
    label,
    color = 'var(--primary-color)',
    size = 'md',
    disabled = false,
    className,
    ...buttonProps
}) {
    const Icon = checked ? FaToggleOn : FaToggleOff;

    return (
        <button
            {...buttonProps}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            className={classNames(
                'Button Button--transparent Switch',
                `Switch--${size}`,
                className
            )}
            onClick={() => onChange(!checked)}
        >
            <Icon
                className={classNames('Icon Switch-icon', {
                    'Icon--text': !checked,
                })}
                style={checked ? { color } : undefined}
                aria-hidden="true"
            />
            <span>{label}</span>
        </button>
    );
}

Switch.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.node.isRequired,
    color: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
};
