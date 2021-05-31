import PropTypes from 'prop-types';
import classNames from 'classnames';
import { HexColorPicker } from 'react-colorful';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';

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
    const color = value || data?.[attribute]

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
            <Disclosure>
                <div className="ColorPicker">
                    <DisclosureButton
                        className="ColorPicker-swatch"
                        style={{ backgroundColor: color }}
                    />
                    <DisclosurePanel className="ColorPicker-picker">
                        <HexColorPicker
                            color={color}
                            onChange={color => handleChange(attribute, color)}
                        />
                    </DisclosurePanel>
                </div>
            </Disclosure>
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
