import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { sanitizeHtml } from 'modules/utils';
import { useWorkbook } from 'modules/workbook';
import PropTypes from 'prop-types';
import { FaPlus, FaTimes } from 'react-icons/fa';

import { BookmarkSegmentModal } from '.';

export default function SegmentContentViewer({
    segment,
    contentLocale,
    displayedContentType,
    onClose,
}) {
    const { t } = useI18n();
    const { locale } = useI18n();
    const { savedSegments: workbookAnnotations } = useWorkbook();

    if (!displayedContentType) {
        return null;
    }

    const annotationsForSegment = workbookAnnotations?.filter(
        (annotation) =>
            annotation.reference_id === segment.id &&
            annotation.reference_type === 'Segment'
    );

    return (
        <div
            className={classNames('SegmentContentViewer', {
                'SegmentContentViewer--annotations':
                    displayedContentType === 'annotations',
                'SegmentContentViewer--references':
                    displayedContentType === 'references',
            })}
        >
            <div className="SegmentContentViewer-header">
                <h3 className="SegmentContentViewer-title">
                    {displayedContentType === 'annotations'
                        ? t('edit.segment.tab_annotations')
                        : displayedContentType === 'references'
                          ? t('edit.segment.tab_registry_references')
                          : t('edit.segment.bookmarks')}
                </h3>
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    onClick={onClose}
                    title={t('common.close')}
                >
                    <FaTimes className="Icon" />
                </button>
            </div>

            <div className="SegmentContentViewer-content">
                {displayedContentType === 'bookmarks' && (
                    <div className="SegmentContentViewer-items SegmentContentViewer-bookmarks">
                        {annotationsForSegment?.map((userAnnotation) => (
                            <p
                                key={userAnnotation.id}
                                className="SegmentContentViewer-item SegmentContentViewer-bookmark"
                            >
                                {userAnnotation.description}
                            </p>
                        ))}
                        <div className="SegmentContentViewer-bookmarkActions">
                            <BookmarkSegmentModal
                                segment={segment}
                                trigger={
                                    <>
                                        <FaPlus className="Icon" />{' '}
                                        {t('save_user_annotation')}
                                    </>
                                }
                                triggerClassName="Button Button--primary"
                            />
                        </div>
                    </div>
                )}

                {displayedContentType === 'annotations' && (
                    <div className="SegmentContentViewer-items SegmentContentViewer-annotations">
                        {Object.values(segment.annotations || {}).map(
                            (annotation) => (
                                <div
                                    key={annotation.id}
                                    className="SegmentContentViewer-item SegmentContentViewer-annotation"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(
                                            annotation.text[contentLocale]
                                        ),
                                    }}
                                />
                            )
                        )}
                    </div>
                )}

                {displayedContentType === 'references' && (
                    <div className="SegmentContentViewer-items SegmentContentViewer-references">
                        {segment.registry_references?.map((reference) => (
                            <div
                                key={reference.id}
                                className="SegmentContentViewer-item SegmentContentViewer-reference"
                            >
                                <div className="SegmentContentViewer-referenceName">
                                    {reference.name[locale]}
                                </div>
                                {reference.notes[locale] && (
                                    <div className="SegmentContentViewer-referenceNotes">
                                        {reference.notes[locale]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

SegmentContentViewer.propTypes = {
    segment: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    displayedContentType: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};
