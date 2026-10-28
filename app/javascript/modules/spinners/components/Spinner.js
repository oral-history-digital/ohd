import classNames from 'classnames';
import { useTheme } from 'modules/layout/ThemeProvider';
import PropTypes from 'prop-types';

/**
 * Displays a themed CSS loading ring with the catalog's border animation.
 *
 * @param {Object} props - Spinner appearance.
 * @param {'small'|'medium'|'large'|number} [props.size='medium'] - Size in pixels or a preset.
 * @param {boolean} [props.withPadding=false] - Adds space around the ring.
 * @param {string} [props.color] - Overrides the current project's primary color.
 * @param {string} [props.className] - Additional wrapper classes.
 * @param {Object} [props.style] - Additional wrapper styles.
 * @returns {JSX.Element} An accessible loading indicator.
 */
export default function Spinner({
    size = 'medium', // 'small' | 'medium' | 'large' or custom size in px
    withPadding = false,
    color = null,
    className,
    style,
}) {
    const { primaryColor } = useTheme();

    const smallPx = 32,
        mediumPx = 96,
        largePx = 128;

    let sizeInPx = mediumPx; // default size for 'medium'

    // ThemeProvider publishes the current project's colors as CSS variables.
    const ringColor = color || `var(--primary-color, ${primaryColor})`;

    if (
        typeof size === 'string' &&
        ['small', 'medium', 'large'].includes(size)
    ) {
        sizeInPx =
            size === 'small' ? smallPx : size === 'medium' ? mediumPx : largePx;
    } else if (typeof size === 'number') {
        sizeInPx = size;
    } else {
        console.warn(
            `Spinner: Invalid size "${size}". Valid options are 'small', 'medium', 'large', or a custom number (px). Defaulting to 'medium'.`
        );
    }

    return (
        <span
            className={classNames('Spinner', className, {
                'Spinner--withPadding': withPadding,
            })}
            style={style}
            role="progressbar"
            aria-label="color-ring-loading"
            aria-busy="true"
        >
            <span
                className="Spinner-ring"
                aria-hidden="true"
                style={{
                    width: sizeInPx,
                    height: sizeInPx,
                    borderTopColor: ringColor,
                }}
            />
        </span>
    );
}

Spinner.propTypes = {
    size: PropTypes.oneOfType([
        PropTypes.oneOf(['small', 'medium', 'large']),
        PropTypes.number,
    ]),
    color: PropTypes.string,
    withPadding: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};
