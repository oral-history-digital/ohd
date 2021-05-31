import PropTypes from 'prop-types';

import Element from '../Element';

export default function Textarea({
    value,
    data,
    attribute,
    scope,
    label,
    labelKey,
    className,
    hidden,
    showErrors,
    individualErrorMsg,
    help,
    validate,
    handleChange,
    handlechangecallback,
    handleErrors,
}) {
    const onChange = event => {
        const newValue = event.target.value;
        const name = event.target.name;

        handleChange(name, newValue, data);

        if (typeof handlechangecallback === 'function') {
            handlechangecallback(name, newValue);
        }

        if (typeof validate === 'function') {
            const valid = validate(newValue);
            handleErrors(name, !valid);
        }
    };

    const actualValue = value || data?.[attribute];

    return (
        <Element
            scope={scope}
            attribute={attribute}
            label={label}
            labelKey={labelKey}
            showErrors={showErrors}
            className={className}
            hidden={hidden}
            valid={typeof validate === 'function' ? validate(actualValue) : true}
            mandatory={typeof validate === 'function'}
            elementType='textarea'
            individualErrorMsg={individualErrorMsg}
            help={help}
        >
            <textarea
                name={attribute}
                defaultValue={actualValue}
                onChange={onChange}
            />
        </Element>
    );
}

Textarea.propTypes = {
    value: PropTypes.string,
    data: PropTypes.object,
    scope: PropTypes.string,
    attribute: PropTypes.string,
    label: PropTypes.string,
    labelKey: PropTypes.string,
    className: PropTypes.string,
    individualErrorMsg: PropTypes.string,
    help: PropTypes.string,
    showErrors: PropTypes.bool,
    hidden: PropTypes.bool,
    validate: PropTypes.func,
    handleChange: PropTypes.func.isRequired,
    handleErrors: PropTypes.func.isRequired,
    handlechangecallback: PropTypes.func,
};
