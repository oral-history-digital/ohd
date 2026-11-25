import { createElement, useState } from 'react';

import { Checkbox } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

import { useTouchFieldOnBlur } from '../../hooks';
import Element from '../shared/Element';

/**
 * Renders an input with form callbacks, labeling, and validation feedback.
 * @param {Object} props - Field configuration and form callbacks.
 * @param {'above'|'beside'} [props.labelPosition] - Label layout inherited from the form or overridden by the field.
 * @returns {React.ReactElement} Form field and feedback.
 */
export default function InputField({
    scope,
    locale,
    attribute,
    type,
    accept,
    value,
    data,
    validate,
    otherError,
    label,
    labelKey,
    labelPosition,
    showErrors,
    optional,
    handleChange,
    handlechangecallback,
    handleErrors,
    touchField,
    help,
    individualErrorMsg,
    hidden,
    className,
    readOnly,
    placeholder,
    id,
}) {
    const onBlur = useTouchFieldOnBlur(touchField);

    // Keep explicit empty-string edits; || would incorrectly fall back to persisted data.
    const defaultValue = value ?? data?.[attribute];

    const [changeFile, setChangeFile] = useState(false);

    const onChange = (event) => {
        let newValue = event.target.files
            ? event.target.files[0]
            : event.target.value;
        if (event.target.type === 'checkbox') {
            newValue = event.target.checked;
        }
        const name = event.target.name;

        handleChange(name, newValue, data);

        if (typeof handlechangecallback === 'function') {
            handlechangecallback(name, newValue, data);
        }

        if (typeof validate === 'function') {
            const valid = validate(newValue, otherError);
            handleErrors(name, !valid);
        }
    };

    const cleanProps = () => {
        const props = {
            id: `${scope}_${id ? id : attribute}`,
            'data-testid': locale
                ? `${scope}-${attribute}-${locale}-${type}-input`
                : `${scope}-${attribute}-${type}-input`,
            className: 'Input',
            type: type,
            name: attribute,
            accept,
            readOnly,
            placeholder,
            defaultChecked: defaultValue,
            defaultValue: defaultValue,
            onChange: onChange,
            onBlur: onBlur,
            onClick: onChange,
        };

        return props;
    };

    const inputOrImg = () => {
        if (type === 'file' && data && data.src && !changeFile) {
            return (
                <div data-testid={`${scope}-${attribute}-image-preview`}>
                    <img src={data.thumb_src} alt="" />
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        onClick={() => setChangeFile(true)}
                    >
                        <FaPencilAlt className="Icon Icon--primary" />
                    </button>
                </div>
            );
        } else if (type === 'checkbox') {
            return createElement(Checkbox, cleanProps());
        } else {
            return createElement('input', cleanProps());
        }
    };

    return (
        <Element
            scope={scope}
            attribute={attribute}
            label={label}
            labelKey={labelKey}
            labelPosition={labelPosition}
            htmlFor={`${scope}_${attribute}`}
            showErrors={showErrors}
            className={className}
            hidden={hidden}
            valid={
                typeof validate === 'function' ? validate(defaultValue) : true
            }
            mandatory={typeof validate === 'function' && !optional}
            elementType={`${type}_input`}
            individualErrorMsg={individualErrorMsg}
            help={help}
        >
            {inputOrImg()}
        </Element>
    );
}

InputField.propTypes = {
    scope: PropTypes.string,
    locale: PropTypes.string,
    attribute: PropTypes.string,
    type: PropTypes.string,
    accept: PropTypes.string,
    value: PropTypes.any,
    data: PropTypes.object,
    validate: PropTypes.func,
    otherError: PropTypes.any,
    label: PropTypes.string,
    labelKey: PropTypes.string,
    labelPosition: PropTypes.oneOf(['above', 'beside']),
    showErrors: PropTypes.bool,
    optional: PropTypes.bool,
    handleChange: PropTypes.func,
    handlechangecallback: PropTypes.func,
    handleErrors: PropTypes.func,
    touchField: PropTypes.func,
    help: PropTypes.node,
    individualErrorMsg: PropTypes.string,
    hidden: PropTypes.bool,
    className: PropTypes.string,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    elementType: PropTypes.string,
    condition: PropTypes.bool,
};
