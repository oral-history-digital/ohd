import { useEffect, useState } from 'react';

import { Button } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaFile, FaTrashAlt } from 'react-icons/fa';

import { formatFileSize } from './utils';

/**
 * Internal presentational item for one selected or persisted file.
 *
 * @param {Object} props
 * @param {Object} props.file File metadata and optional preview source. It
 * requires `name`; `size` is measured in bytes. Persisted files normally use
 * `url` and `contentType`, while local files use browser `File` as `source` and
 * its MIME `type`. Local image object URLs are created and revoked internally.
 * @param {'auto'|'image'|'icon'|false} [props.preview='auto'] Preview mode;
 * `auto` detects images from their MIME type.
 * @param {string} props.removeLabel Visible-tooltip and accessible action text.
 * @param {Function} [props.onRemove] Removal callback. If omitted, no remove
 * action is rendered.
 * @param {boolean} [props.disabled=false] Disables the remove action.
 */
export default function FileItem({
    file,
    preview = 'auto',
    removeLabel,
    onRemove,
    disabled = false,
}) {
    const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
    const contentType = file.contentType || file.type || '';
    const isImage =
        preview === 'image' ||
        (preview === 'auto' && contentType.startsWith('image/'));

    useEffect(() => {
        if (!isImage || !file.source || !URL.createObjectURL) return undefined;

        const objectUrl = URL.createObjectURL(file.source);
        setLocalPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file.source, isImage]);

    const previewUrl = localPreviewUrl || file.url;
    const size = formatFileSize(file.size);

    return (
        <li className="FileInputField-item">
            <div className="FileInputField-preview" aria-hidden="true">
                {isImage && previewUrl ? (
                    <img src={previewUrl} alt="" />
                ) : (
                    <FaFile />
                )}
            </div>
            <div className="FileInputField-fileInfo">
                <span className="FileInputField-filename">{file.name}</span>
                {size && (
                    <span className="FileInputField-filesize">{size}</span>
                )}
            </div>
            {onRemove && (
                <Button
                    className="FileInputField-remove"
                    variant="outlined"
                    color="error"
                    buttonText={removeLabel}
                    ariaLabel={`${removeLabel}: ${file.name}`}
                    title={`${removeLabel}: ${file.name}`}
                    isIconOnly
                    startIcon={<FaTrashAlt aria-hidden="true" />}
                    onClick={onRemove}
                    isDisabled={disabled}
                />
            )}
        </li>
    );
}

FileItem.propTypes = {
    file: PropTypes.shape({
        name: PropTypes.string.isRequired,
        size: PropTypes.number,
        type: PropTypes.string,
        contentType: PropTypes.string,
        url: PropTypes.string,
        source: PropTypes.instanceOf(File),
    }).isRequired,
    preview: PropTypes.oneOf(['auto', 'image', 'icon', false]),
    removeLabel: PropTypes.string.isRequired,
    onRemove: PropTypes.func,
    disabled: PropTypes.bool,
};
