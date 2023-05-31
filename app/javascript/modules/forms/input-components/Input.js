import PropTypes from 'prop-types';
import { createElement, useState, useEffect } from 'react';
import { FaPencilAlt} from 'react-icons/fa';

import { Checkbox } from 'modules/ui';
import Element from '../Element';

export default function Input({
    scope,
    attribute,
    type,
    value,
    data,
    validate,
    otherError,
    label,
    labelKey,
    showErrors,
    optional,
    handleChange,
    handlechangecallback,
    handleErrors,
    help,
    individualErrorMsg,
    hidden,
    className,
    readOnly,
    placeholder,
    forceUpdateFromProps,
}) {

    const [valid, setValid] = useState((typeof validate !== 'function') || optional);
    const [changeFile, setChangeFile] = useState(false);
    const [val, setVal] = useState(data?.[attribute] || value);

    useEffect(() => {
        setVal(data?.[attribute] || value);
        if (typeof(validate) === 'function') {
            const valid = validate(val);
            handleErrors(attribute, !valid);
        }
        handleChange(attribute, val, data);
    }, [value, data?.[attribute]]);


    const onChange = (event) => {
        let v = event.target.files ? event.target.files[0] : event.target.value;
        if (event.target.type === 'checkbox') {
            v = event.target.checked;
        }

        setVal(v);

        const name =  event.target.name;

        handleChange(name, v, data);

        if (typeof handlechangecallback === 'function') {
            handlechangecallback(name, v, data);
        }

        if (typeof(validate) === 'function') {
            if (validate(v, otherError)) {
                handleErrors(name, false);
                setValid(true)
            } else {
                handleErrors(name, true);
                setValid(false)
            }
        }
    }

    const cleanProps = () => {
        const props = {
            id: `${scope}_${attribute}`,
            className: 'Input',
            type: type,
            name: attribute,
            readOnly,
            placeholder,
            defaultChecked: val,
            defaultValue: val,
            onChange: onChange,
            onClick: onChange,
        }

        if (forceUpdateFromProps)
            props.value = val; //data && data[attribute] || val;

        return props;
    };


    const inputOrImg = () => {
        if (type === 'file' && data && data.src && !changeFile) {
            return (
                <div>
                    <img src={data.thumb_src} alt="" />
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        onClick={() => setChangeFile(true)}
                    >
                        <FaPencilAlt className="Icon Icon--primary" />
                    </button>
                </div>
            )
        } else if (type === 'checkbox') {
            return createElement(Checkbox, cleanProps());
        } else {
            return createElement('input', cleanProps());
        }
    }

    return (
        <Element
            scope={scope}
            attribute={attribute}
            label={label}
            labelKey={labelKey}
            htmlFor={`${scope}_${attribute}`}
            showErrors={showErrors}
            className={className}
            hidden={hidden}
            valid={valid}
            mandatory={typeof validate === 'function' && !optional}
            elementType={`${type}_input`}
            individualErrorMsg={individualErrorMsg}
            help={help}
        >
            {inputOrImg()}
        </Element>
    );
}

Input.propTypes = {
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string,
};
