import classNames from 'classnames';
import PropTypes from 'prop-types';

import { unescapeHtmlEntities } from '../../../utils';

export default function EditableSegmentText({
    segment,
    locale,
    originalText,
    editedText,
    onTextChange,
}) {
    const currentText =
        editedText !== null ? editedText : unescapeHtmlEntities(originalText);

    return (
        <textarea
            className={classNames('EditableSegment-textarea', {
                'EditableSegment-textarea--rtl': segment.textDir === 'rtl',
            })}
            lang={locale}
            dir={segment.textDir || 'auto'}
            value={currentText}
            onChange={(e) => onTextChange(e.target.value)}
        />
    );
}

EditableSegmentText.propTypes = {
    segment: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    originalText: PropTypes.string.isRequired,
    editedText: PropTypes.string,
    onTextChange: PropTypes.func.isRequired,
};
