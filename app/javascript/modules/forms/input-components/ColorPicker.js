import { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { HexColorPicker } from 'react-colorful';

import Element from '../Element';
import useClickOutside from './useClickOutside';

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
    const popover = useRef();
    const [isOpen, toggle] = useState(false);

    const color = value || data?.[attribute]
    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            toggle(false);
        }

        if (event.keyCode === 13 && isOpen) {
            toggle(false);
            event.preventDefault();
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
            <div className="ColorPicker">
                <button
                    type="button"
                    className="ColorPicker-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => toggle(!isOpen)}
                    onKeyDown={handleKeyDown}
                />
                {isOpen && (
                    <div
                        className="ColorPicker-popover"
                        ref={popover}
                        onKeyDown={handleKeyDown}
                        role="dialog"
                    >
                        <HexColorPicker
                            color={color}
                            onChange={color => handleChange(attribute, color)}
                        />
                    </div>
                )}
            </div>
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
