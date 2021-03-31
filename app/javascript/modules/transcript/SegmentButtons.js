import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { SegmentHeadingFormContainer } from 'modules/toc';
import { Modal } from 'modules/ui';
import { Annotations } from 'modules/annotations';
import { RegistryReferencesContainer } from 'modules/registry-references';
import SegmentFormContainer from './SegmentFormContainer';

export default class SegmentButtons extends React.Component {
    openReference() {
        const { openReference } = this.props;

        if (openReference) {
            return (
                <div className='scope-note'>
                    <div onClick={() => this.props.setOpenReference(null)} className='close'></div>
                    <div className='title'>{openReference.name[this.props.contentLocale]}</div>
                    <div className='note'>{openReference.notes[this.props.contentLocale]}</div>
                </div>
            )
        }
    }

    references(locale) {
        if (
            this.props.popupType === 'references' &&
            (this.props.data.registry_references_count > 0 || admin(this.props, {type: 'RegistryReference', action: 'create', interview_id: this.props.data.interview_id}))
        ) {
            return <RegistryReferencesContainer
                       refObject={this.props.data}
                       lowestAllowedRegistryEntryId={1}
                       inTranscript={true}
                       locale={locale}
                       setOpenReference={this.props.setOpenReference}
                   />
        }
    }

    annotations(locale) {
        if (
            this.props.popupType === 'annotations' &&
            (this.props.data.annotations_count > 0 || admin(this.props, {type: 'Annotation', action: 'create', interview_id: this.props.data.interview_id}))
        ) {
            return <Annotations segment={this.props.data} contentLocale={locale} />
        }
    }

    userAnnotations() {
        if (
            this.props.popupType === 'annotations'
        ) {
            return this.props.data.user_annotation_ids.map((uId, index) => {
                    if(this.props.userContents && this.props.userContents[uId] && this.props.userContents[uId].description) {
                        return  <p className='content-trans-text-element-data' key={"userAnnotation-" + index}>
                                {this.props.userContents[uId].description}
                            </p>
                    }
            }).filter((a) => a )
        } else {
            return [];
        }
    }

    renderLinks(locale, userAnnotations) {
        const { data, popupType, openPopup, closePopup } = this.props;

        if (
            admin(this.props, {type: 'General', action: 'edit'}) ||
            data.annotations_count > 0 ||
            data.registry_references_count > 0 ||
            userAnnotations.length > 0
        ) {
            let icoCss = this.props.popupType !== null ? 'active' : '';


            let hasAnnotations = data.annotations_count > 0 || userAnnotations.length > 0
            let annotationCss = admin(this.props, {type: 'Annotation', action: 'update', interview_id: data.interview_id}) || hasAnnotations ? 'content-trans-text-ico-link' : 'hidden';
            let hasAnnotationsCss = hasAnnotations ? 'exists' : '';
            let annotationsTitle = hasAnnotations ? t(this.props, 'edit.segment.annotations.edit') : t(this.props, 'edit.segment.annotations.new')

            let hasReferences = data.registry_references_count > 0;
            let referencesCss = admin(this.props, {type: 'RegistryReference', action: 'update', interview_id: data.interview_id}) || hasReferences ? 'content-trans-text-ico-link' : 'hidden';
            let hasReferencesCss = hasReferences ? 'exists' : '';
            let referencesTitle = hasReferences ? t(this.props, 'edit.segment.references.edit') : t(this.props, 'edit.segment.references.new')

            return (
                <div className={icoCss}>
                    {this.edit()}
                    {this.editHeadings()}
                    <div
                        className={annotationCss} title={annotationsTitle}
                        onClick={() => popupType === 'annotations' ? closePopup() : openPopup(data.id, 'annotations')}
                    >
                        <i className={`fa fa-sticky-note-o ${hasAnnotationsCss}`} />
                    </div>
                    <div
                        className={referencesCss}
                        title={referencesTitle}
                        onClick={() => popupType === 'references' ? closePopup() : openPopup(data.id, 'references')}
                    >
                        <i className={`fa fa-tag ${hasReferencesCss}`} />
                    </div>
                </div>
            )
        }
    }

    edit() {
        let title = this.props.tabIndex == 1 ? 'edit.segment.translation' : 'edit.segment.transcript'
        if (admin(this.props, this.props.data)) {
            return (
                <Modal
                    title={t(this.props, title)}
                    trigger={<i className="fa fa-pencil"/>}
                >
                    {closeModal => (
                        <SegmentFormContainer
                            segment={this.props.data}
                            contentLocale={this.props.contentLocale}
                            onSubmit={closeModal}
                        />
                    )}
                </Modal>
            )
        } else {
            return null;
        }
    }

    editHeadings() {
        const { data } = this.props;

        if (admin(this.props, data)) {
            let title = data.has_heading ? t(this.props, 'edit.segment.heading.edit') : t(this.props, 'edit.segment.heading.new')
            return (
                <Modal
                    title={title}
                    trigger={(
                        <i className={classNames('fa', 'fa-header', {
                            'empty': !data.has_heading,
                        })} />
                    )}
                >
                    {closeModal => (
                        <SegmentHeadingFormContainer
                            segment={this.props.data}
                            onSubmit={closeModal}
                        />
                    )}
                </Modal>
            )
        } else {
            return null;
        }
    }

    render() {
        const { contentLocale } = this.props;

        let uAnnotations = this.userAnnotations();

        return (
            <div className="Segment-buttons">
                {this.renderLinks(contentLocale, uAnnotations)}
                <div className={classNames(this.props.popupType !== null ? 'content-trans-text-element' : 'hidden')}>
                    <div>
                        {this.annotations(contentLocale)}
                        {uAnnotations}
                    </div>
                    <div className='content-trans-text-element-data'>
                        {this.references(contentLocale)}
                        {this.openReference()}
                    </div>
                </div>
            </div>
        );
    }
}

SegmentButtons.propTypes = {
    data: PropTypes.object.isRequired,
    contentLocale: PropTypes.string.isRequired,
    popupType: PropTypes.string,
    openReference: PropTypes.object,
    openPopup: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
    setOpenReference: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
    people: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    statuses: PropTypes.object.isRequired,
    userContents: PropTypes.object,
    tabIndex: PropTypes.number.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
