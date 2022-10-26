import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Element from '../Element';

export default function DatePicker({
    attribute,
    className,
    data,
    elementType,
    handleChange,
    help,
    hidden,
    scope,
    showErrors,
    value,
}) {
    const date = value || data?.[attribute] || '';

    console.log(date)

    function handleInputChange(event) {
        const dateStr = event.target.value;
        handleChange(attribute, dateStr);
    }

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
            <input
                type="date"
                defaultValue={date}
                onChange={handleInputChange}
            />
        </Element>
    );
}

DatePicker.propTypes = {
    attribute: PropTypes.string.isRequired,
    className: PropTypes.string,
    data: PropTypes.object.isRequired,
    elementType: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    help: PropTypes.string,
    hidden: PropTypes.bool,
    scope: PropTypes.string.isRequired,
    showErrors: PropTypes.bool,
    value: PropTypes.string,
};
