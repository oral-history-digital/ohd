import PropTypes from 'prop-types';
import { createElement, useState } from 'react';
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
    id,
}) {

    const defaultValue = value || data?.[attribute];
    const [changeFile, setChangeFile] = useState(false);

    const onChange = (event) => {
        let newValue = event.target.files ? event.target.files[0] : event.target.value;
        if (event.target.type === 'checkbox') {
            newValue = event.target.checked;
        }
        const name =  event.target.name;

        handleChange(name, newValue, data);

        if (typeof handlechangecallback === 'function') {
            handlechangecallback(name, newValue, data);
        }

        if (typeof validate === 'function') {
            const valid = validate(newValue, otherError);
            handleErrors(name, !valid);
        }
    }

    const cleanProps = () => {
        const props = {
            id: `${scope}_${id ? id : attribute}`,
            className: 'Input',
            type: type,
            name: attribute,
            readOnly,
            placeholder,
            defaultChecked: defaultValue,
            defaultValue: defaultValue,
            onChange: onChange,
            onClick: onChange,
        }

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
            valid={typeof validate === 'function' ? validate(defaultValue) : true}
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
