import { useState } from 'react';

import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@reach/disclosure';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { HexColorInput, HexColorPicker } from 'react-colorful';

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
    const [open, setOpen] = useState(false);

    const color = value || data?.[attribute] || '';
    const onChange = (color) => handleChange(attribute, color);
    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form from being submitted.
            setOpen(false);
        }
    };

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
            <Disclosure open={open} onChange={() => setOpen(!open)}>
                <div className="ColorPicker">
                    <DisclosureButton
                        className="ColorPicker-swatch"
                        style={{ backgroundColor: color }}
                    />
                    <DisclosurePanel className="ColorPicker-picker">
                        <HexColorPicker color={color} onChange={onChange} />
                        <HexColorInput
                            color={color}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
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
