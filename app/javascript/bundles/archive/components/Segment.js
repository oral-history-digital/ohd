import React from 'react';
import VizSensor from 'react-visibility-sensor';
import SegmentFormContainer from '../containers/SegmentFormContainer';
import SegmentHeadingFormContainer from '../containers/SegmentHeadingFormContainer';
import RegistryReferencesContainer from '../containers/RegistryReferencesContainer';
import AnnotationsContainer from '../containers/AnnotationsContainer';
import { t, fullname, admin } from "../../../lib/utils";

export default class Segment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contentOpen: false,
            contentType: 'none',
            visible: false
        };

        this.setOpenReference = this.setOpenReference.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.state.contentOpen != nextState.contentOpen) || (this.state.contentType != nextState.contentType)) {
            return true;
        }
        if (nextState.openReference !== this.state.openReference) {
            return true;
        }
        if (nextProps.statuses[this.props.data.id] !== this.props.statuses[this.props.data.id]) {
            return true;
        }
        if (nextProps.active !== this.props.active) {
            return true;
        }
        if (nextProps.editView !== this.props.editView) {
            return true;
        }

        return false;
    }

    css() {
        return 'segment ' + (this.props.active ? 'active' : 'inactive');
    }

    transcript() {
        return admin(this.props, this.props.data) ? (this.props.data.text[`${this.props.contentLocale}-original`] || this.props.data.text[`${this.props.contentLocale}-public`]) :
               (this.props.data.text[`${this.props.contentLocale}-public`] || '')
    }

    has_headings() {
       let mainheading = this.props.data.mainheading[`${this.props.contentLocale}-original`] || this.props.data.mainheading[`${this.props.contentLocale}-public`]
       let subheading = this.props.data.subheading[`${this.props.contentLocale}-original`] || this.props.data.subheading[`${this.props.contentLocale}-public`]
       return  !!(mainheading || subheading)
    }

    toggleAdditionalContent(type) {
        let state = this.state.contentOpen;

        let newState = type != this.state.contentType ? true : !state;

        this.setState({
            contentOpen: newState,
            contentType: type
        });
    }

    setOpenReference(entry) {
        this.setState({openReference: entry});
    }

    openReference() {
        if (this.state.openReference) {
            return (
                <div className='scope-note'>
                    <div onClick={() => this.setOpenReference(null)} className='close'></div>
                    <div className='title'>{this.state.openReference.name[this.props.contentLocale]}</div>
                    <div className='note'>{this.state.openReference.notes[this.props.contentLocale]}</div>
                </div>
            )
        }
    }

    references(locale) {
        if (
            this.state.contentType == 'references' &&
            (this.props.data.references_count[locale] > 0 || admin(this.props, {type: 'RegistryReference', action: 'create'}))
        ) {
            return <RegistryReferencesContainer
                       refObject={this.props.data}
                       parentEntryId={1}
                       locale={locale}
                       setOpenReference={this.setOpenReference}
                   />
        }
    }

    annotations(locale) {
        if (
            this.state.contentType == 'annotations' &&
            (this.props.data.annotations_count[locale] > 0 || admin(this.props, {type: 'Annotation', action: 'create'}))
        ) {
            return <AnnotationsContainer segment={this.props.data} locale={locale} />
        }
    }

    userAnnotations() {
        if (
            this.state.contentType == 'annotations'
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

    speakerChanged() {
        return (this.props.data.speaker_changed || this.props.data.speakerIdChanged);
    }

    speakerIcon() {
        if (this.speakerChanged()) {
            let speakerCss = this.props.data.speaker_is_interviewee ? "fa fa-user" : "fa fa-user-o";
            return (
                <div
                    className="content-trans-speaker-link"
                    title={(this.props.people && this.props.data.speaker_id) ? fullname(this.props, this.props.people[this.props.data.speaker_id]) : this.props.data.speaker}
                    onClick={() => this.props.handleSegmentClick(this.props.data.tape_nbr, this.props.data.time, this.props.tabIndex)}
                >
                    <i className={speakerCss}></i>
                </div>
            )
        }
    }

    renderLinks(locale, userAnnotations) {
        if (
            admin(this.props, {type: 'RegistryReference', action: 'update'}) ||
            this.props.data.annotations_count[this.props.contentLocale] > 0 ||
            this.props.data.references_count[this.props.contentLocale] > 0 ||
            userAnnotations.length > 0
        ) {
            let icoCss = this.state.contentOpen ? 'content-trans-text-ico active' : 'content-trans-text-ico';
            let annotionCss = admin(this.props, {type: 'Annotation', action: 'update'}) ||
                this.props.data.annotations_count[this.props.contentLocale] > 0 ||
                userAnnotations.length > 0 ?
                'content-trans-text-ico-link' : 'hidden';
            let referenceCss = admin(this.props, {type: 'RegistryReference', action: 'update'}) ||
                this.props.data.references_count[this.props.contentLocale] > 0 ?
                'content-trans-text-ico-link' : 'hidden';

            return (
                <div className={icoCss}>
                    {this.edit(locale)}
                    {this.editHeadings(locale)}
                    <div className={annotionCss} title={t(this.props, 'annotations')}
                         onClick={() => this.toggleAdditionalContent('annotations')}><i
                        className="fa fa-sticky-note-o"></i>
                    </div>
                    <div className={referenceCss} title={t(this.props, (this.props.project === 'mog') ? 'keywords_mog' : 'keywords')}
                         onClick={() => this.toggleAdditionalContent('references')}><i className="fa fa-tag"></i>
                    </div>
                </div>
            )
        }
    }

    edit(locale) {
        if (admin(this.props, {type: 'Segment', action: 'update'})) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.segment.edit')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.segment.edit'),
                        content: <SegmentFormContainer segment={this.props.data} contentLocale={this.props.contentLocale} />
                    })}
                >
                    <i className="fa fa-pencil"></i>
                </div>
            )
        } else {
            return null;
        }
    }

    editHeadingIcon() {
        if (this.has_headings()) {
            return (
                <span className="fa-stack fa-1x heading-exists">
                    <i className="fa fa-pencil fa-stack-1x fa-stack-first-custom heading-exists"></i>
                    <i className="fa fa-header fa-stack-1x fa-stack-second-custom heading-exists"></i>
                </span>
          )
        }
        else {
            return (
                <span className="fa-stack fa-1x">
                    <i className="fa fa-pencil fa-stack-1x fa-stack-first-custom"></i>
                    <i className="fa fa-plus fa-stack-1x fa-stack-second-custom"></i>
                </span>
            )
        }
    }

    editHeadings(locale) {
        if (admin(this.props, {type: 'Segment', action: 'update'})) {
            let title = this.has_headings() ? t(this.props, 'edit.segment.edit_heading') : t(this.props, 'edit.segment.add_heading')
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={title}
                    onClick={() => this.props.openArchivePopup({
                        title: title,
                        content: <SegmentHeadingFormContainer segment={this.props.data} contentLocale={this.props.contentLocale} />
                    })}
                >
                {this.editHeadingIcon()}
                </div>
            )
        } else {
            return null;
        }
    }

    render() {
        let contentOpenClass = this.state.contentOpen ? 'content-trans-text-element' : 'hidden';
        let contentTransRowCss = this.speakerChanged() ? 'content-trans-row speaker-change' : 'content-trans-row';
        let text = this.transcript();
        let uAnnotations = this.userAnnotations();

        if (text) {
            return (
                <VizSensor
                    partialVisibility={true}
                    onChange={(isVisible) => {
                        this.setState({visible: isVisible})
                    }}
                >
                    <div id={`segment_${this.props.data.id}`} className={contentTransRowCss}>
                        <div className="content-trans-speaker-ico">
                            {this.speakerIcon()}
                        </div>
                        <div className='content-trans-text'
                             onClick={() => this.props.handleSegmentClick(this.props.data.tape_nbr, this.props.data.time, this.props.tabIndex)}>
                            <div className={this.css()}
                                 // TODO: clean mog segment-texts from html in db
                                 //dangerouslySetInnerHTML={{__html: text}}
                            >
                                {text}
                            </div>
                        </div>
                        {this.renderLinks(this.props.contentLocale, uAnnotations)}
                        <div className={contentOpenClass}>
                            <div>
                                {this.annotations(this.props.contentLocale)}
                                {uAnnotations}
                            </div>
                            <div className='content-trans-text-element-data'>
                                {this.references(this.props.contentLocale)}
                                {this.openReference()}
                            </div>
                        </div>
                    </div>
                </VizSensor>
            )
        } else {
            return null;
        }
    }
}
