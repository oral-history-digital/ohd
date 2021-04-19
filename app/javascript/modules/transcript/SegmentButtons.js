import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaHeading, FaPencilAlt, FaStickyNote, FaTag } from 'react-icons/fa';

import { useAuthorization, AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { SegmentHeadingFormContainer } from 'modules/toc';
import { Modal } from 'modules/ui';
import SegmentFormContainer from './SegmentFormContainer';

export default function SegmentButtons({
    contentLocale,
    data,
    popupType,
    userContents,
    tabIndex,
    active,
    openPopup,
    closePopup,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();

    const userAnnotations = data.user_annotation_ids
        .map(id => userContents?.[id])
        .filter(annotation => typeof annotation !== 'undefined');

    const hasAnnotations = (data.annotations_count + userAnnotations.length) > 0;
    const hasReferences = data.registry_references_count > 0;
    const showAnnotationsButton = isAuthorized({type: 'Annotation', action: 'update', interview_id: data.interview_id}) || hasAnnotations;
    const showReferencesButton = isAuthorized({type: 'RegistryReference', action: 'update', interview_id: data.interview_id}) || hasReferences;

    return (
        <div className={classNames('Segment-buttons', { 'is-active': active })}>
            <AuthorizedContent object={data}>
                <Modal
                    title={t(tabIndex === 1 ? 'edit.segment.translation' : 'edit.segment.transcript')}
                    trigger={<FaPencilAlt className="Button-icon" />}
                    triggerClassName="Button Button--primary"
                >
                    {closeModal => (
                        <SegmentFormContainer
                            segment={data}
                            contentLocale={contentLocale}
                            onSubmit={closeModal}
                        />
                    )}
                </Modal>
                <Modal
                    title={t(data.has_heading ? 'edit.segment.heading.edit' : 'edit.segment.heading.new')}
                    trigger={<FaHeading className="Button-icon" />}
                    triggerClassName={classNames('Button', data.has_heading ? 'Button--primary' : 'Button--editorial')}
                >
                    {closeModal => (
                        <SegmentHeadingFormContainer
                            segment={data}
                            onSubmit={closeModal}
                        />
                    )}
                </Modal>
            </AuthorizedContent>
            {
                showAnnotationsButton && (
                    <button
                        type="button"
                        className={classNames('Button', hasAnnotations ? 'Button--primary' : 'Button--editorial')}
                        title={t(hasAnnotations ? 'edit.segment.annotations.edit' : 'edit.segment.annotations.new')}
                        onClick={() => popupType === 'annotations' ? closePopup() : openPopup(data.id, 'annotations')}
                    >
                        <FaStickyNote className="Button-icon" />
                    </button>
                )
            }
            {
                showReferencesButton && (
                    <button
                        type="button"
                        className={classNames('Button', hasReferences ? 'Button--primary' : 'Button--editorial' )}
                        title={t(hasReferences ? 'edit.segment.references.edit' : 'edit.segment.references.new')}
                        onClick={() => popupType === 'references' ? closePopup() : openPopup(data.id, 'references')}
                    >
                        <FaTag className="Button-icon" />
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
    userContents: PropTypes.object,
    tabIndex: PropTypes.number.isRequired,
    active: PropTypes.bool,
    openPopup: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
};
