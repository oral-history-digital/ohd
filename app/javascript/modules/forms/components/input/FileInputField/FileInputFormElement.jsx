import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import { useTouchFieldOnBlur } from '../../../hooks';
import FileInputField from './FileInputField';

/**
 * Connects FileInputField to the generic Form element API.
 */
export default function FileInputFormElement({
    scope,
    attribute,
    value,
    data,
    label,
    labelKey,
    help,
    accept,
    maxSize,
    maxFiles,
    multiple,
    preview = 'auto',
    optional,
    validate,
    otherError,
    showErrors,
    individualErrorMsg,
    handleChange,
    handleErrors,
    touchField,
    disabled,
}) {
    const { t } = useI18n();
    const onBlur = useTouchFieldOnBlur(touchField);
    const id = `${scope}_${attribute}`;
    const labelText =
        label || t(labelKey || `activerecord.attributes.${scope}.${attribute}`);
    const currentFiles = data?.src
        ? {
              name: data.filename || labelText,
              url: data.thumb_src || data.src,
              contentType: 'image/*',
          }
        : [];
    const valid = typeof validate === 'function' ? validate(value) : true;
    const error =
        !valid && showErrors
            ? t(
                  individualErrorMsg
                      ? `activerecord.errors.models.${scope}.attributes.${attribute}.${individualErrorMsg}`
                      : 'activerecord.errors.default.file_input'
              )
            : undefined;

    function onChange(file) {
        handleChange(attribute, file, data);

        if (typeof validate === 'function') {
            handleErrors(attribute, !validate(file, otherError));
        }
    }

    return (
        <FileInputField
            id={id}
            name={attribute}
            label={labelText}
            value={value}
            currentFiles={currentFiles}
            accept={accept}
            maxSize={maxSize}
            maxFiles={maxFiles}
            multiple={multiple}
            preview={preview}
            required={typeof validate === 'function' && !optional}
            disabled={disabled}
            help={typeof help === 'string' ? t(help) : help}
            error={error}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}

FileInputFormElement.propTypes = {
    scope: PropTypes.string.isRequired,
    attribute: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.instanceOf(File),
        PropTypes.arrayOf(PropTypes.instanceOf(File)),
    ]),
    data: PropTypes.object,
    label: PropTypes.string,
    labelKey: PropTypes.string,
    help: PropTypes.node,
    accept: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    maxSize: PropTypes.number,
    maxFiles: PropTypes.number,
    multiple: PropTypes.bool,
    preview: PropTypes.oneOf(['auto', 'image', 'icon', false]),
    optional: PropTypes.bool,
    validate: PropTypes.func,
    otherError: PropTypes.any,
    showErrors: PropTypes.bool,
    individualErrorMsg: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
    handleErrors: PropTypes.func.isRequired,
    touchField: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};
