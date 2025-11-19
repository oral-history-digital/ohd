import { useTheme } from 'modules/layout/ThemeProvider';
import PropTypes from 'prop-types';
import { ColorRing } from 'react-loader-spinner';

export default function Spinner({
    small = false,
    withPadding = false,
    className,
    style,
}) {
    const { secondaryColor } = useTheme();
    return (
        <>
            <ColorRing
                visible={true}
                height={small ? 32 : 96}
                width={small ? 32 : 96}
                ariaLabel="color-ring-loading"
                wrapperStyle={style}
                wrapperClass={`color-ring-wrapper ${className} ${
                    withPadding ? 'color-ring-wrapper--withPadding' : ''
                } ${small ? 'color-ring-wrapper--small' : ''}`}
                // Some versions of the loader ignore `color` and render the default
                // 5-color gradient. Provide a 5-item `colors` array where every
                // entry is the same color to guarantee a solid appearance.
                colors={[
                    secondaryColor,
                    secondaryColor,
                    secondaryColor,
                    secondaryColor,
                    secondaryColor,
                ]}
            />
        </>
    );
}

Spinner.propTypes = {
    small: PropTypes.bool,
    withPadding: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};
