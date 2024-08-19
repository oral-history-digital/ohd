import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaHeading, FaPencilAlt, FaStickyNote, FaTag } from 'react-icons/fa';

import { useAuthorization, AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { SegmentHeadingForm } from 'modules/toc';
import { Modal } from 'modules/ui';
import SegmentFormContainer from './SegmentFormContainer';

export default function SegmentButtons({
    contentLocale,
    data,
    popupType,
    workbookAnnotations,
    tabIndex,
    active,
    openPopup,
    closePopup,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();

    const annotationsForSegment = workbookAnnotations?.filter(annotation =>
        data.user_annotation_ids.includes(annotation.id));

    const hasAnnotations = (data.annotations_count + (annotationsForSegment?.length || 0)) > 0;
    const hasReferences = data.registry_references_count > 0;
    const showAnnotationsButton = isAuthorized({type: 'Annotation', interview_id: data.interview_id}, 'update') || hasAnnotations;
    const showReferencesButton = isAuthorized({type: 'RegistryReference', interview_id: data.interview_id}, 'update') || hasReferences;

    return (
        <div className={classNames('Segment-buttons', { 'is-active': active })}>
            <AuthorizedContent object={data} action='update'>
                <Modal
                    title={t(tabIndex === 1 ? 'edit.segment.translation' : 'edit.segment.transcript')}
                    trigger={<FaPencilAlt className="Icon Icon--editorial" />}
                    triggerClassName="Button Button--icon"
                >
                    {closeModal => (
                        <SegmentFormContainer
                            segment={data}
                            contentLocale={contentLocale}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
                <Modal
                    title={t(data.has_heading ? 'edit.segment.heading.edit' : 'edit.segment.heading.new')}
                    trigger={<FaHeading className={classNames('Icon', data.has_heading ? 'Icon--primary' : 'Icon--editorial')} />}
                    triggerClassName="Button Button--icon"
                >
                    {closeModal => (
                        <SegmentHeadingForm
                            segment={data}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </AuthorizedContent>
            {
                showAnnotationsButton && (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t(hasAnnotations ? 'edit.segment.annotations.edit' : 'edit.segment.annotations.new')}
                        onClick={() => popupType === 'annotations' ? closePopup() : openPopup(data.id, 'annotations')}
                    >
                        <FaStickyNote className={classNames('Icon', hasAnnotations ? 'Icon--primary' : 'Icon--editorial')} />
                    </button>
                )
            }
            {
                showReferencesButton && (
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t(hasReferences ? 'edit.segment.references.edit' : 'edit.segment.references.new')}
                        onClick={() => popupType === 'references' ? closePopup() : openPopup(data.id, 'references')}
                    >
                        <FaTag className={classNames('Icon', hasReferences ? 'Icon--primary' : 'Icon--editorial')} />
                    </button>
                )
            }
        </div>
    );
}

SegmentButtons.propTypes = {
    data: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    popupType: PropTypes.string,
    workbookAnnotations: PropTypes.array,
    tabIndex: PropTypes.number.isRequired,
    active: PropTypes.bool,
    openPopup: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
};
