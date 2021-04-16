import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
    openPopup,
    closePopup,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();

    const userAnnotations = data.user_annotation_ids.map(id => userContents[id]);
    const hasAnnotations = (data.annotations_count + userAnnotations.length) > 0;
    const hasReferences = data.registry_references_count > 0;
    const showAnnotationsButton = isAuthorized({type: 'Annotation', action: 'update', interview_id: data.interview_id}) || hasAnnotations;
    const showReferencesButton = isAuthorized({type: 'RegistryReference', action: 'update', interview_id: data.interview_id}) || hasReferences;

    return (
        <div className="Segment-buttons">
            <AuthorizedContent object={data}>
                <Modal
                    title={t(tabIndex === 1 ? 'edit.segment.translation' : 'edit.segment.transcript')}
                    trigger={<i className="fa fa-pencil"/>}
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
                    trigger={(
                        <i className={classNames('fa', 'fa-header', {
                            'empty': !data.has_heading,
                        })} />
                    )}
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
                        className={classNames('Button')}
                        title={t(hasAnnotations ? 'edit.segment.annotations.edit' : 'edit.segment.annotations.new')}
                        onClick={() => popupType === 'annotations' ? closePopup() : openPopup(data.id, 'annotations')}
                    >
                        <i className={classNames('fa fa-sticky-note-o', { 'exists': hasAnnotations })} />
                    </button>
                )
            }
            {
                showReferencesButton && (
                    <button
                        type="button"
                        className={classNames('Button')}
                        title={t(hasReferences ? 'edit.segment.references.edit' : 'edit.segment.references.new')}
                        onClick={() => popupType === 'references' ? closePopup() : openPopup(data.id, 'references')}
                    >
                        <i className={classNames('fa fa-tag', { 'exists': hasReferences })} />
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
    openPopup: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
    userContents: PropTypes.object,
    tabIndex: PropTypes.number.isRequired,
};
