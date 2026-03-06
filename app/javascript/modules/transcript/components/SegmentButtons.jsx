import { memo } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { useWorkbook } from 'modules/workbook';
import PropTypes from 'prop-types';
import {
    FaHeading,
    FaPencilAlt,
    FaStar,
    FaStickyNote,
    FaTag,
} from 'react-icons/fa';

import { BookmarkSegmentModal } from '.';

function SegmentButtons({
    segment,
    contentLocale,
    onEditStart,
    onViewContentType,
    isEditingSegment,
    canEditSegment,
}) {
    const { t } = useI18n();
    const { savedSegments } = useWorkbook();

    const hasHeadings = segment.has_heading;

    // Annotations are tied to the content locales
    const hasAnnotations = Object.values(segment.annotations || {}).some(
        (annotation) =>
            Object.prototype.hasOwnProperty.call(annotation.text, contentLocale)
    );
    const hasBookmarks = (savedSegments || []).some(
        (annotation) =>
            annotation.reference_id === segment.id &&
            annotation.reference_type === 'Segment'
    );
    const hasReferences = (segment.registry_references_count || 0) > 0;

    const showEditButton = canEditSegment;
    const showHeadingsButton = canEditSegment || hasHeadings;
    const showAnnotationsButton = canEditSegment || hasAnnotations;
    const showReferencesButton = canEditSegment || hasReferences;

    const handleBookmarkClick = () => {
        if (hasBookmarks) {
            // If bookmarks exist, show the viewer
            onViewContentType?.('bookmarks');
        }
        // If no bookmarks, opening modal is handled by BookmarkSegmentModal
    };

    const handleEditClick = () => {
        onEditStart('edit');
    };

    const handleHeadingsClick = () => {
        if (canEditSegment) {
            // Editor: always open tabs
            onEditStart('headings');
        } else {
            // Non-editor: show inline viewer
            onViewContentType?.('headings');
        }
    };

    const handleAnnotationsClick = () => {
        if (canEditSegment) {
            // Editor: always open tabs
            onEditStart('annotations');
        } else {
            // Non-editor: show inline viewer
            onViewContentType?.('annotations');
        }
    };

    const handleReferencesClick = () => {
        if (canEditSegment) {
            // Editor: always open tabs
            onEditStart('references');
        } else {
            // Non-editor: show inline viewer
            onViewContentType?.('references');
        }
    };

    // Hide buttons if the segment is being edited. Tabs replace the button functionality
    if (isEditingSegment) return null;

    return (
        <>
            <div className={classNames('Segment-buttons')}>
                {hasBookmarks ? (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t('modules.workbook.bookmarks')}
                        onClick={handleBookmarkClick}
                    >
                        <FaStar className="Icon Icon--primary" />
                    </button>
                ) : (
                    <BookmarkSegmentModal segment={segment} />
                )}
                {showEditButton && (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t('edit.segment.transcript')}
                        onClick={handleEditClick}
                    >
                        <FaPencilAlt className="Icon Icon--editorial" />
                    </button>
                )}
                {showHeadingsButton && (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t(
                            hasHeadings
                                ? 'edit.segment.heading.edit'
                                : 'edit.segment.heading.new'
                        )}
                        onClick={handleHeadingsClick}
                    >
                        <FaHeading
                            className={classNames(
                                'Icon',
                                hasHeadings
                                    ? 'Icon--primary'
                                    : 'Icon--editorial'
                            )}
                        />
                    </button>
                )}
                {showAnnotationsButton && (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t(
                            hasAnnotations
                                ? 'edit.segment.annotations.edit'
                                : 'edit.segment.annotations.new'
                        )}
                        onClick={handleAnnotationsClick}
                    >
                        <FaStickyNote
                            className={classNames(
                                'Icon',
                                hasAnnotations
                                    ? 'Icon--primary'
                                    : 'Icon--editorial'
                            )}
                        />
                    </button>
                )}
                {showReferencesButton && (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t(
                            hasReferences
                                ? 'edit.segment.references.edit'
                                : 'edit.segment.references.new'
                        )}
                        onClick={handleReferencesClick}
                    >
                        <FaTag
                            className={classNames(
                                'Icon',
                                hasReferences
                                    ? 'Icon--primary'
                                    : 'Icon--editorial'
                            )}
                        />
                    </button>
                )}
            </div>
        </>
    );
}

SegmentButtons.propTypes = {
    segment: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    onEditStart: PropTypes.func.isRequired,
    onViewContentType: PropTypes.func,
    isEditingSegment: PropTypes.bool,
    canEditSegment: PropTypes.bool,
};

export default memo(SegmentButtons);
