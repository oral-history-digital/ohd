import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { Button } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaExchangeAlt, FaFolderOpen, FaPlus, FaUpload } from 'react-icons/fa';

import FileItem from './FileItem';
import {
    fileIdentity,
    normalizeAccept,
    normalizeCurrentFiles,
    normalizeSelectedFiles,
    validateFiles,
} from './utils';

/**
 * Controlled file-selection field with validation, previews, and removal UI.
 * Uploading files and deleting persisted files remain the parent form's
 * responsibility.
 *
 * @param {Object} props
 * @param {string} props.id Unique input ID used by the associated label.
 * @param {string} props.name Native form-field name.
 * @param {string} props.label Visible and accessible field label.
 * @param {File|File[]|null} [props.value] Controlled, newly selected local
 * file or files. Use an array when `multiple` is true.
 * @param {Object|Object[]} [props.currentFiles] Files already persisted by the
 * parent feature. Each object requires `name` and may provide `id`, `url`,
 * `contentType`, and byte `size`. They are separate from `value`.
 * @param {string|string[]} [props.accept] Native file-input accept values,
 * such as `image/png`, `image/*`, or `.ico`.
 * @param {number} [props.maxSize] Maximum size of each selected file in bytes.
 * @param {number} [props.maxFiles] Maximum total number of persisted and newly
 * selected files in multiple mode. In single mode, a new file replaces the
 * persisted file.
 * @param {boolean} [props.multiple=false] Enables selection of multiple files
 * and makes `onChange` return a `File[]`.
 * @param {'auto'|'image'|'icon'|false} [props.preview='auto'] Preview mode.
 * `auto` previews recognized images, `image` forces image treatment, and
 * `icon` or `false` displays a generic file icon.
 * @param {boolean} [props.required=false] Marks the native input as required
 * when no persisted file exists.
 * @param {boolean} [props.disabled=false] Disables selection and file actions.
 * @param {React.ReactNode} [props.help] Help or constraint text displayed
 * below the selection control.
 * @param {React.ReactNode} [props.error] Server-side or parent validation
 * message. Client-side validation messages are managed internally.
 * @param {string} [props.removeCurrentLabel] Accessible label used for removal
 * of persisted files. Defaults to the generic translated removal label.
 * @param {(value: File|File[]|null) => void} props.onChange Receives `File` or
 * `null` in single mode and `File[]` in multiple mode.
 * @param {Function} [props.onBlur] Native file-input blur handler.
 * @param {Function} [props.onRemoveCurrent] Receives the persisted-file object
 * whose removal was requested. The parent performs the actual deletion.
 *
 * @example
 * <FileInputField
 *     id="avatar"
 *     name="avatar"
 *     label="Avatar"
 *     value={file}
 *     accept={['image/png', 'image/jpeg']}
 *     maxSize={5 * 1024 * 1024}
 *     onChange={setFile}
 * />
 *
 * @example
 * <FileInputField
 *     id="documents"
 *     name="documents[]"
 *     label="Documents"
 *     value={files}
 *     multiple
 *     maxFiles={10}
 *     onChange={setFiles}
 * />
 */
export default function FileInputField({
    id,
    name,
    label,
    value,
    currentFiles = [],
    accept,
    maxSize,
    maxFiles,
    multiple = false,
    preview = 'auto',
    required = false,
    disabled = false,
    help,
    error,
    removeCurrentLabel,
    onChange,
    onBlur,
    onRemoveCurrent,
}) {
    const { t } = useI18n();
    const inputRef = useRef(null);
    const [validationError, setValidationError] = useState(null);
    const selectedFiles = normalizeSelectedFiles(value, multiple);
    const persistedFiles = normalizeCurrentFiles(currentFiles);
    const visiblePersistedFiles =
        multiple || selectedFiles.length === 0 ? persistedFiles : [];
    const hasFiles =
        visiblePersistedFiles.length > 0 || selectedFiles.length > 0;
    const totalFileCount = persistedFiles.length + selectedFiles.length;
    const canSelectMore = !multiple || !maxFiles || totalFileCount < maxFiles;
    const helpId = help ? `${id}-help` : undefined;
    const errorId = error || validationError ? `${id}-error` : undefined;
    const describedBy =
        [helpId, errorId].filter(Boolean).join(' ') || undefined;
    const acceptValue = normalizeAccept(accept).join(',');

    // Reset the input value when all selected files are removed,
    // so that the same file can be re-selected if needed.
    useEffect(() => {
        if (selectedFiles.length === 0 && inputRef.current) {
            inputRef.current.value = '';
        }
    }, [selectedFiles.length]);

    function translatedError(validation) {
        if (!validation) return null;

        return t(`file_input.errors.${validation.code}`, {
            filename: validation.file?.name,
            max: maxSize,
            count: maxFiles,
        });
    }

    // Emit the selected files to the parent component.
    function emitFiles(files) {
        onChange(multiple ? files : files[0] || null);
    }

    function handleChange(event) {
        const incomingFiles = Array.from(event.target.files || []);
        if (incomingFiles.length === 0) return;

        const candidates = multiple
            ? // Combine existing and incoming files, filtering out duplicates by identity.
              [...selectedFiles, ...incomingFiles].filter(
                  (file, index, allFiles) =>
                      allFiles.findIndex(
                          (candidate) =>
                              fileIdentity(candidate) === fileIdentity(file)
                      ) === index
              )
            : incomingFiles.slice(0, 1);
        const validation = validateFiles(candidates, {
            accept,
            maxSize,
            maxFiles: multiple ? maxFiles : 1,
            currentFileCount: multiple ? persistedFiles.length : 0,
        });

        if (validation) {
            setValidationError(translatedError(validation));
            event.target.value = '';
            return;
        }

        setValidationError(null);
        emitFiles(candidates);
    }

    function removeSelectedFile(fileToRemove) {
        const remainingFiles = selectedFiles.filter(
            (file) => fileIdentity(file) !== fileIdentity(fileToRemove)
        );
        emitFiles(remainingFiles);
        setValidationError(null);
        if (inputRef.current) inputRef.current.value = '';
    }

    return (
        <div className="FileInputField">
            <label className="FormLabel" htmlFor={id}>
                {label}
                {required && <span aria-hidden="true"> *</span>}
            </label>
            <input
                ref={inputRef}
                id={id}
                name={name}
                className="FileInputField-nativeInput"
                type="file"
                accept={acceptValue || undefined}
                multiple={multiple}
                required={required && persistedFiles.length === 0}
                disabled={disabled}
                aria-describedby={describedBy}
                aria-invalid={Boolean(error || validationError)}
                onChange={handleChange}
                onBlur={onBlur}
            />
            {!hasFiles && (
                <div
                    className={classNames('FileInputField-picker', {
                        'FileInputField-picker--invalid':
                            error || validationError,
                    })}
                >
                    <FaUpload
                        className="FileInputField-pickerIcon"
                        aria-hidden="true"
                    />
                    <div className="FileInputField-pickerContent">
                        <span className="FileInputField-pickerText">
                            {t(
                                multiple
                                    ? 'file_input.instruction_multiple'
                                    : 'file_input.instruction'
                            )}
                        </span>
                        <Button
                            type="button"
                            variant="contained"
                            size="sm"
                            buttonText={t(
                                multiple
                                    ? 'file_input.choose_multiple'
                                    : 'file_input.choose'
                            )}
                            startIcon={<FaFolderOpen aria-hidden="true" />}
                            onClick={() => inputRef.current?.click()}
                            isDisabled={disabled}
                        />
                    </div>
                </div>
            )}
            {help && (
                <p id={helpId} className="help-block">
                    {help}
                </p>
            )}

            {(visiblePersistedFiles.length > 0 || selectedFiles.length > 0) && (
                <ul
                    className="FileInputField-list"
                    aria-label={label}
                    aria-live="polite"
                >
                    {visiblePersistedFiles.map((file, index) => (
                        <FileItem
                            key={file.id || file.url || `${file.name}-${index}`}
                            file={file}
                            preview={preview}
                            removeLabel={
                                removeCurrentLabel || t('file_input.remove')
                            }
                            onRemove={
                                onRemoveCurrent
                                    ? () => onRemoveCurrent(file)
                                    : undefined
                            }
                            disabled={disabled}
                        />
                    ))}
                    {selectedFiles.map((file) => (
                        <FileItem
                            key={fileIdentity(file)}
                            file={{
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                source: file,
                            }}
                            preview={preview}
                            removeLabel={t('file_input.discard')}
                            onRemove={() => removeSelectedFile(file)}
                            disabled={disabled}
                        />
                    ))}
                </ul>
            )}

            {hasFiles && canSelectMore && (
                <div className="FileInputField-actions">
                    <Button
                        type="button"
                        variant="outlined"
                        size="sm"
                        buttonText={t(
                            multiple
                                ? 'file_input.add_another'
                                : 'file_input.replace'
                        )}
                        startIcon={
                            multiple ? (
                                <FaPlus aria-hidden="true" />
                            ) : (
                                <FaExchangeAlt aria-hidden="true" />
                            )
                        }
                        onClick={() => inputRef.current?.click()}
                        isDisabled={disabled}
                    />
                </div>
            )}

            {(error || validationError) && (
                <p id={errorId} className="help-block has-error" role="alert">
                    {error || validationError}
                </p>
            )}
        </div>
    );
}

const currentFileShape = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    contentType: PropTypes.string,
    size: PropTypes.number,
});

FileInputField.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.instanceOf(File),
        PropTypes.arrayOf(PropTypes.instanceOf(File)),
    ]),
    currentFiles: PropTypes.oneOfType([
        currentFileShape,
        PropTypes.arrayOf(currentFileShape),
    ]),
    accept: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    maxSize: PropTypes.number,
    maxFiles: PropTypes.number,
    multiple: PropTypes.bool,
    preview: PropTypes.oneOf(['auto', 'image', 'icon', false]),
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    help: PropTypes.node,
    error: PropTypes.node,
    removeCurrentLabel: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onRemoveCurrent: PropTypes.func,
};
