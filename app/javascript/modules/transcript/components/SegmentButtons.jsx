import { memo } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import {
    FaHeading,
    FaPencilAlt,
    FaStar,
    FaStickyNote,
    FaTag,
} from 'react-icons/fa';

import { getSegmentAnnotations } from '../utils';

function SegmentButtons({
    segment,
    contentLocale,
    onEditStart,
    onViewContentType,
    onBookmarkCreate,
    isEditingSegment,
    canEditSegment,
    hasBookmarks,
}) {
    const { t } = useI18n();

    const hasHeadings = segment.has_heading;

    // Annotations are tied to the content locales
    const hasAnnotations =
        getSegmentAnnotations(segment, contentLocale).length > 0;
    const hasReferences = (segment.registry_references_count || 0) > 0;

    const showEditButton = canEditSegment;
    const showHeadingsButton = canEditSegment;
    const showAnnotationsButton = canEditSegment || hasAnnotations;
    const showReferencesButton = canEditSegment || hasReferences;

    const handleBookmarkClick = () => {
        if (hasBookmarks) {
            // If bookmarks exist, show the viewer
            onViewContentType?.('bookmarks');
            return;
        }

        onBookmarkCreate?.(segment);
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
            <div
                className={classNames('Segment-buttons')}
                data-testid="segment-buttons"
            >
                <button
                    type="button"
                    className={classNames(
                        'Button Button--transparent Button--icon',
                        {
                            'Segment-hiddenButton Button--hover': !hasBookmarks,
                        }
                    )}
                    title={t(
                        hasBookmarks
                            ? 'modules.workbook.bookmarks'
                            : 'save_user_annotation'
                    )}
                    onClick={handleBookmarkClick}
                    data-testid="segment-button-bookmarks"
                >
                    <FaStar
                        className={classNames(
                            'Icon',
                            hasBookmarks ? 'Icon--primary' : 'Icon--unobtrusive'
                        )}
                    />
                </button>
                {showEditButton && (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t('edit.segment.transcript')}
                        onClick={handleEditClick}
                        data-testid="segment-button-edit"
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
                        data-testid="segment-button-headings"
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
                        data-testid="segment-button-annotations"
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
                        data-testid="segment-button-references"
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
    onBookmarkCreate: PropTypes.func,
    isEditingSegment: PropTypes.bool,
    canEditSegment: PropTypes.bool,
    hasBookmarks: PropTypes.bool,
};

export default memo(SegmentButtons);
