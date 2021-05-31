import PropTypes from 'prop-types';
import { HexColorPicker } from 'react-colorful';

import Element from '../Element';

export default function ColorPicker({
    value,
    attribute,
    scope,
    elementType,
    className,
    help,
    showErrors,
    hidden,
    data,
    handleChange,
}) {
    return (
        <Element
            scope={scope}
            attribute={attribute}
            elementType={elementType}
            className={className}
            help={help}
            showErrors={showErrors}
            hidden={hidden}
        >
            <HexColorPicker
                color={value || data?.[attribute]}
                onChange={color => handleChange(attribute, color)}
            />
        </Element>
    );
}

ColorPicker.propTypes = {
    value: PropTypes.string,
    attribute: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    elementType: PropTypes.string.isRequired,
    className: PropTypes.string,
    help: PropTypes.string,
    showErrors: PropTypes.bool,
    hidden: PropTypes.bool,
    data: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
};
