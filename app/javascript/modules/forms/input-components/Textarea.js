import PropTypes from 'prop-types';
import { checkTextDir } from '../../transcript/utils';

import Element from '../Element';

export default function Textarea({
    value,
    data,
    attribute,
    htmlOptions,
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
    id,
}) {
    const defaultValue = value || data?.[attribute];
    // Determine text direction
    const textDir = checkTextDir(defaultValue || '');

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

    return (
        <Element
            scope={scope}
            attribute={attribute}
            label={label}
            labelKey={labelKey}
            showErrors={showErrors}
            className={className}
            hidden={hidden}
            valid={typeof validate === 'function' ? validate(defaultValue) : true}
            mandatory={typeof validate === 'function'}
            elementType='textarea'
            individualErrorMsg={individualErrorMsg}
            help={help}
            htmlFor={`${scope}_${attribute}`}
        >
            <textarea
                id={`${scope}_${id ? id : attribute}`}
                name={attribute}
                className="Input"
                defaultValue={defaultValue}
                onChange={onChange}
                {...htmlOptions}
                dir={textDir}
                style={{ direction: textDir, textAlign: textDir === 'rtl' ? 'right' : 'left'}}
            />
        </Element>
    );
}

Textarea.propTypes = {
    value: PropTypes.string,
    data: PropTypes.object,
    htmlOptions: PropTypes.object,
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
