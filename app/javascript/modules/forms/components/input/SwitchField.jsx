import classNames from 'classnames';
import { Switch } from 'modules/ui';
import PropTypes from 'prop-types';

import { useTouchFieldOnBlur } from '../../hooks';
import Element from '../shared/Element';

/**
 * Connects a boolean form field to the shared switch and translated field label.
 *
 * @param {Object} props - Field definition, value, validation, and form callbacks.
 * @returns {React.ReactElement} Labeled switch with help and validation feedback.
 */
export default function SwitchField({
    scope,
    attribute,
    value,
    data,
    label,
    labelKey,
    help,
    validate,
    otherError,
    showErrors,
    optional,
    individualErrorMsg,
    handleChange,
    handlechangecallback,
    handleErrors,
    touchField,
    hidden,
    className,
    disabled,
    readOnly,
    id,
}) {
    const checked = Boolean(value ?? data?.[attribute] ?? false);
    const fieldId = `${scope}_${id ?? attribute}`;
    const onBlur = useTouchFieldOnBlur(touchField);

    /**
     * Updates form state and runs the field's change and validation callbacks.
     * @param {boolean} nextChecked - Requested switch state.
     */
    function onChange(nextChecked) {
        handleChange(attribute, nextChecked, data);
        handlechangecallback?.(attribute, nextChecked, data);
        if (validate) {
            handleErrors(attribute, !validate(nextChecked, otherError));
        }
    }

    return (
        <Element
            scope={scope}
            attribute={attribute}
            label={label}
            labelKey={labelKey}
            htmlFor={fieldId}
            help={help}
            valid={validate ? validate(checked, otherError) : true}
            showErrors={showErrors}
            mandatory={Boolean(validate) && !optional}
            individualErrorMsg={individualErrorMsg}
            elementType="checkbox_input"
            hidden={hidden}
            className={classNames('SwitchField', className)}
        >
            <Switch
                id={fieldId}
                name={attribute}
                label=""
                size="lg"
                checked={checked}
                disabled={disabled || readOnly}
                onChange={onChange}
                onBlur={onBlur}
            />
        </Element>
    );
}

SwitchField.propTypes = {
    scope: PropTypes.string,
    attribute: PropTypes.string.isRequired,
    value: PropTypes.bool,
    data: PropTypes.object,
    label: PropTypes.string,
    labelKey: PropTypes.string,
    help: PropTypes.node,
    validate: PropTypes.func,
    otherError: PropTypes.any,
    showErrors: PropTypes.bool,
    optional: PropTypes.bool,
    individualErrorMsg: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handlechangecallback: PropTypes.func,
    handleErrors: PropTypes.func,
    touchField: PropTypes.func,
    hidden: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
