import { useTheme } from 'modules/layout/ThemeProvider';
import PropTypes from 'prop-types';
import { ColorRing } from 'react-loader-spinner';

export default function Spinner({
    size = 'medium', // 'small' | 'medium' | 'large' or custom size in px
    withPadding = false,
    color = null,
    className,
    style,
}) {
    const { secondaryColor } = useTheme();

    const smallPx = 32,
        mediumPx = 96,
        largePx = 128;

    let sizeInPx = mediumPx; // default size for 'medium'

    const ringColor = color || secondaryColor;

    if (
        typeof size === 'string' &&
        ['small', 'medium', 'large'].includes(size)
    ) {
        sizeInPx =
            size === 'small' ? smallPx : size === 'medium' ? mediumPx : largePx;
    } else if (typeof size === 'number') {
        sizeInPx = size;
    }

    const isSmall = sizeInPx <= smallPx;

    return (
        <>
            <ColorRing
                visible={true}
                height={sizeInPx}
                width={sizeInPx}
                ariaLabel="color-ring-loading"
                wrapperStyle={style}
                wrapperClass={`color-ring-wrapper ${className} ${
                    withPadding ? 'color-ring-wrapper--withPadding' : ''
                } ${isSmall ? 'color-ring-wrapper--small' : ''}`}
                // Some versions of the loader ignore `color` and render the default
                // 5-color gradient. Provide a 5-item `colors` array where every
                // entry is the same color to guarantee a solid appearance.
                colors={[ringColor, ringColor, ringColor, ringColor, ringColor]}
            />
        </>
    );
}

Spinner.propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
    withPadding: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};
