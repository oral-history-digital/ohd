import { useState } from 'react';

import classNames from 'classnames';
import { Fetch } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { RegistryReferencesContainer } from 'modules/registry-references';
import { useProject } from 'modules/routes';
import { sanitizeHtml } from 'modules/utils';
import { useWorkbook } from 'modules/workbook';
import PropTypes from 'prop-types';
import { FaPlus, FaTimes } from 'react-icons/fa';

import { BookmarkSegmentModal } from '.';

export default function SegmentContentViewer({
    segment,
    interview,
    contentLocale,
    displayedContentType,
    onClose,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();
    const { savedSegments: workbookAnnotations } = useWorkbook();
    const [openReference, setOpenReference] = useState(null);

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
                        <Fetch
                            fetchParams={[
                                'registry_entries',
                                null,
                                null,
                                `ref_object_type=Segment&ref_object_id=${segment.id}`,
                            ]}
                            testDataType="registry_entries"
                            testIdOrDesc={`ref_object_type_Segment_ref_object_id_${segment.id}`}
                        >
                            <Fetch
                                fetchParams={[
                                    'registry_entries',
                                    project?.root_registry_entry_id,
                                ]}
                                testDataType="registry_entries"
                                testIdOrDesc={project?.root_registry_entry_id}
                            >
                                <RegistryReferencesContainer
                                    refObject={segment}
                                    interview={interview}
                                    inTranscript
                                    contentLocale={contentLocale}
                                    setOpenReference={setOpenReference}
                                />
                            </Fetch>
                        </Fetch>

                        {openReference && (
                            <div className="SegmentContentViewer-item SegmentContentViewer-reference">
                                <div className="SegmentContentViewer-referenceName">
                                    {openReference.name?.[contentLocale] ||
                                        openReference.name?.[locale]}
                                </div>
                                {(openReference.notes?.[contentLocale] ||
                                    openReference.notes?.[locale]) && (
                                    <div className="SegmentContentViewer-referenceNotes">
                                        {openReference.notes?.[contentLocale] ||
                                            openReference.notes?.[locale]}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

SegmentContentViewer.propTypes = {
    segment: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    displayedContentType: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};
