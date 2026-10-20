import { useState } from 'react';

import classNames from 'classnames';
import { Fetch } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { RegistryReferencesContainer } from 'modules/registry-references';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { sanitizeHtml } from 'modules/utils';
import { useWorkbook } from 'modules/workbook';
import PropTypes from 'prop-types';
import { FaPlus, FaTimes } from 'react-icons/fa';

import { BookmarkSegmentModal } from '.';
import { getSegmentAnnotations, getSegmentWorkbookAnnotations } from '../utils';

/**
 * Shows segment annotations, bookmarks, or registry references in the selected language.
 *
 * @param {Object} props - Segment content context.
 * @param {Object} props.segment - Segment with annotations and references.
 * @param {Object} props.interview - Interview used by reference permissions.
 * @param {string} props.contentLocale - Selected content language.
 * @param {string} [props.displayedContentType] - Panel to display; empty closes the viewer.
 * @param {Function} props.onClose - Closes the viewer.
 * @returns {React.ReactElement|null} Content panel or nothing when closed.
 */
export default function SegmentContentViewer({
    segment,
    interview,
    contentLocale,
    displayedContentType,
    onClose,
}) {
    const { t, locale } = useI18n();
    const { project, isLoading, error } = useProject({
        include:
            displayedContentType === 'references'
                ? ['registry_configuration']
                : [],
    });
    const { savedSegments: workbookAnnotations } = useWorkbook();
    const [openReference, setOpenReference] = useState(null);
    const referencesReady =
        !isLoading && !error && !!project?.root_registry_entry_id;

    if (!displayedContentType) {
        return null;
    }

    const workbookAnnotationsForSegment = getSegmentWorkbookAnnotations(
        workbookAnnotations,
        segment.id
    );

    // Annotations are tied to the content locales, so only show
    // if there are annotations in the current content locale
    const annotationsInLocale = getSegmentAnnotations(segment, contentLocale);

    return (
        <div
            className={classNames('SegmentContentViewer', {
                'SegmentContentViewer--annotations':
                    displayedContentType === 'annotations',
                'SegmentContentViewer--references':
                    displayedContentType === 'references',
            })}
            data-testid="segment-content-viewer"
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
                    data-testid="segment-content-viewer-close"
                >
                    <FaTimes className="Icon" />
                </button>
            </div>

            <div className="SegmentContentViewer-content">
                {displayedContentType === 'bookmarks' && (
                    <div
                        className="SegmentContentViewer-items SegmentContentViewer-bookmarks"
                        data-testid="segment-bookmarks"
                    >
                        {workbookAnnotationsForSegment?.map(
                            (userAnnotation) => (
                                <p
                                    key={userAnnotation.id}
                                    className="SegmentContentViewer-item SegmentContentViewer-bookmark"
                                >
                                    {userAnnotation.description}
                                </p>
                            )
                        )}
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
                    <div
                        className="SegmentContentViewer-items SegmentContentViewer-annotations"
                        data-testid="segment-annotations-viewer"
                    >
                        {annotationsInLocale.map((annotation) => (
                            <div
                                key={annotation.id}
                                className="SegmentContentViewer-item SegmentContentViewer-annotation"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(
                                        annotation.text[contentLocale]
                                    ),
                                }}
                            />
                        ))}
                    </div>
                )}

                {displayedContentType === 'references' && (
                    <div
                        className="SegmentContentViewer-items SegmentContentViewer-references"
                        data-testid="segment-references-viewer"
                    >
                        {error && (
                            <InlineNotification
                                variant="error"
                                title={t('error')}
                                description={error.message}
                                isClosable={false}
                            />
                        )}
                        {!error && (isLoading || !project) && <Spinner />}
                        {referencesReady && (
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
                                    testIdOrDesc={
                                        project?.root_registry_entry_id
                                    }
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
                        )}

                        {referencesReady &&
                            openReference &&
                            (openReference.notes?.[contentLocale] ||
                                openReference.notes?.[locale]) && (
                                <div className="SegmentContentViewer-item SegmentContentViewer-reference">
                                    <div className="SegmentContentViewer-referenceNotes">
                                        {openReference.notes?.[contentLocale] ||
                                            openReference.notes?.[locale]}
                                    </div>
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
