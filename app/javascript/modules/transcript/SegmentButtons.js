import classNames from 'classnames';
import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useScrollOffset } from 'modules/media-player';
import { SegmentHeadingForm } from 'modules/toc';
import { Modal } from 'modules/ui';
import { scrollSmoothlyTo } from 'modules/user-agent';
import { useWorkbook } from 'modules/workbook';
import PropTypes from 'prop-types';
import { FaHeading, FaPencilAlt, FaStickyNote, FaTag } from 'react-icons/fa';
import SegmentFormContainer from './SegmentFormContainer';

export default function SegmentButtons({
    contentLocale,
    data,
    popupType,
    tabIndex,
    active,
    openPopup,
    closePopup,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();
    const { savedSegments: workbookAnnotations } = useWorkbook();
    const scrollOffset = useScrollOffset();

    const annotationsForSegment = workbookAnnotations?.some((annotation) =>
        data.user_annotation_ids.includes(annotation.id)
    );

    const hasAnnotationsInContentLocale = Object.values(data.annotations).some(
        (annotation) =>
            Object.prototype.hasOwnProperty.call(annotation.text, contentLocale)
    );
    const hasAnnotations =
        hasAnnotationsInContentLocale || annotationsForSegment;
    const hasReferences = data.registry_references_count > 0;
    const showAnnotationsButton =
        isAuthorized(
            { type: 'Annotation', interview_id: data.interview_id },
            'update'
        ) || hasAnnotations;
    const showReferencesButton =
        isAuthorized(
            { type: 'RegistryReference', interview_id: data.interview_id },
            'update'
        ) || hasReferences;

    const handleButtonClick = () => {
        const segmentElement = document.getElementById(`segment_${data.id}`);
        if (segmentElement) {
            const topOfSegment = segmentElement.offsetTop;
            // Scroll to the top of the segment, minus an offset to account for fixed headers
            // or other UI elements that might obscure the segment.
            if (topOfSegment !== 0) {
                scrollSmoothlyTo(0, topOfSegment - scrollOffset);
            }
        }
    };

    return (
        <div className={classNames('Segment-buttons', { 'is-active': active })}>
            <AuthorizedContent object={data} action="update">
                <Modal
                    title={t(
                        tabIndex === 1
                            ? 'edit.segment.translation'
                            : 'edit.segment.transcript'
                    )}
                    trigger={<FaPencilAlt className="Icon Icon--editorial" />}
                    triggerClassName="Button Button--icon"
                    onBeforeOpen={handleButtonClick}
                >
                    {(closeModal) => (
                        <SegmentFormContainer
                            segment={data}
                            contentLocale={contentLocale}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
                <Modal
                    title={t(
                        data.has_heading
                            ? 'edit.segment.heading.edit'
                            : 'edit.segment.heading.new'
                    )}
                    trigger={
                        <FaHeading
                            className={classNames(
                                'Icon',
                                data.has_heading
                                    ? 'Icon--primary'
                                    : 'Icon--editorial'
                            )}
                        />
                    }
                    triggerClassName="Button Button--icon"
                >
                    {(closeModal) => (
                        <SegmentHeadingForm
                            segment={data}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </AuthorizedContent>
            {showAnnotationsButton && (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t(
                        hasAnnotations
                            ? 'edit.segment.annotations.edit'
                            : 'edit.segment.annotations.new'
                    )}
                    onClick={() =>
                        popupType === 'annotations'
                            ? closePopup()
                            : openPopup(data.id, 'annotations')
                    }
                >
                    <FaStickyNote
                        className={classNames(
                            'Icon',
                            hasAnnotations ? 'Icon--primary' : 'Icon--editorial'
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
                    onClick={() =>
                        popupType === 'references'
                            ? closePopup()
                            : openPopup(data.id, 'references')
                    }
                >
                    <FaTag
                        className={classNames(
                            'Icon',
                            hasReferences ? 'Icon--primary' : 'Icon--editorial'
                        )}
                    />
                </button>
            )}
        </div>
    );
}

SegmentButtons.propTypes = {
    data: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    popupType: PropTypes.string,
    tabIndex: PropTypes.number.isRequired,
    active: PropTypes.bool,
    openPopup: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
};
