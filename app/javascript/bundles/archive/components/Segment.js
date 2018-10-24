import React from 'react';
import SegmentFormContainer from '../containers/SegmentFormContainer';
import SegmentHeadingFormContainer from '../containers/SegmentHeadingFormContainer';
import SegmentRegistryReferencesContainer from '../containers/SegmentRegistryReferencesContainer';
import AnnotationsContainer from '../containers/AnnotationsContainer';
import { t, fullname, admin } from "../../../lib/utils";

export default class Segment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contentOpen: false,
            contentType: 'none'
        };
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
        let locale = this.props.originalLocale ? this.props.interview.lang : this.props.locale;
        return (this.props.data.transcripts) ? this.props.data.transcripts[locale] : ''
    }

    toggleAdditionalContent(type) {
        let state = this.state.contentOpen;

        let newState = type != this.state.contentType ? true : !state;

        this.setState({
            contentOpen: newState,
            contentType: type
        });
    }

    setOpenReference(reference) {
        this.setState({openReference: reference});
    }

    openReference() {
        if (this.state.openReference) {
            let openReference = this.state.openReference.desc_with_note[this.props.locale];
            return (
                <div className='scope-note'>
                    <div onClick={() => this.setOpenReference(null)} className='close'></div>
                    <div className='title'>{openReference.title}</div>
                    <div className='note'>{openReference.note}</div>
                </div>
            )
        }
    }

    references(locale) {
        if (this.state.contentType == 'references') {
            return <SegmentRegistryReferencesContainer segment={this.props.data} interview={this.props.interview} locale={locale} />
            //return this.props.data.references.map((reference, index) => {
                //if (reference.desc_with_note[locale] && reference.desc_with_note[locale].note) {
                    //return (
                        //<span 
                            //id={`reference_${reference.id}`} 
                            //className='scope-note-link'
                            //key={"reference-" + index} 
                            //onClick={() => this.setOpenReference(reference)}
                        //>
                            //{reference.desc_with_note[locale].title}
                        //</span>
                    //)
                //} else {
                    //return <span id={`reference_${reference.id}`} key={"reference-" + index}>{reference.desc_with_note[locale].title}</span>
                //}
            //})
        }
    }

    annotations(locale) {
        if (this.state.contentType == 'annotations') {
            return <AnnotationsContainer segment={this.props.data} locale={locale} />
        }
    }

    userAnnotations() {
        if (this.state.contentType == 'annotations') {
            return this.props.data.user_annotation_ids.map((uId, index) => {
                    return  <p className='content-trans-text-element-data' key={"userAnnotation-" + index}>
                                {this.props.userContents[uId].description}
                            </p>
            })
        }
    }

    speakerChanged() {
        return (this.props.data.speaker_changed || this.props.data.speakerIdChanged);
    }

    speakerIcon() {
        if (this.speakerChanged()) {
            let speakerCss = this.props.data.speaker_is_interviewee ? "fa fa-user" : "fa fa-user-o";
            return (
                <div className="content-trans-speaker-link" title={fullname(this.props, this.props.data.speaking_person)}
                     onClick={() => this.props.handleSegmentClick(this.props.data.tape_nbr, this.props.data.time)}>
                    <i className={speakerCss}></i>
                </div>
            )
        }
    }

    renderLinks(locale) {
        if (
            admin(this.props) || 
            (Object.values(this.props.data.annotations).length > 0 || this.props.data.references_count > 0 || this.props.data.user_annotation_ids.length)
        ) {
            let icoCss = this.state.contentOpen ? 'content-trans-text-ico active' : 'content-trans-text-ico';
            let annotionCss = admin(this.props) || Object.values(this.props.data.annotations).length > 0 || this.props.data.user_annotation_ids.length > 0 ? 'content-trans-text-ico-link' : 'hidden';
            let referenceCss = admin(this.props) || this.props.data.references_count > 0 ? 'content-trans-text-ico-link' : 'hidden';

            return (
                <div className={icoCss}>
                    {this.edit(locale)}
                    {this.editHeadings(locale)}
                    <div className={annotionCss} title={t(this.props, 'annotations')}
                         onClick={() => this.toggleAdditionalContent('annotations')}><i
                        className="fa fa-sticky-note-o"></i>
                    </div>
                    <div className={referenceCss} title={t(this.props, 'keywords')}
                         onClick={() => this.toggleAdditionalContent('references')}><i className="fa fa-tag"></i>
                    </div>
                </div>
            )
        }
    }

    edit(locale) {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.segment.edit')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.segment.edit'),
                        content: <SegmentFormContainer segment={this.props.data} locale={locale} />
                    })}
                >
                    <i className="fa fa-pencil"></i>
                </div>
            )
        } else {
            return null;
        }
    }

    editHeadings(locale) {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.segment.edit_heading')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.segment.edit_heading'),
                        content: <SegmentHeadingFormContainer segment={this.props.data} locale={locale} />
                    })}
                >
                    <i className="fa fa-pencil"></i>
                </div>
            )
        } else {
            return null;
        }
    }

    render() {
        let locale = this.props.originalLocale ? this.props.interview.lang : this.props.locale;
        let contentOpenClass = this.state.contentOpen ? 'content-trans-text-element' : 'hidden';
        let contentTransRowCss = this.speakerChanged() ? 'content-trans-row speaker-change' : 'content-trans-row';
        if (this.transcript()) {
            return (
                    <div id={`segment_${this.props.data.id}`} className={contentTransRowCss}>
                        <div className="content-trans-speaker-ico">
                            {this.speakerIcon()}
                        </div>
                        <div className='content-trans-text'
                             onClick={() => this.props.handleSegmentClick(this.props.data.tape_nbr, this.props.data.time)}>
                            <div className={this.css()}
                                 dangerouslySetInnerHTML={{__html: this.transcript()}}
                            />
                        </div>
                        {this.renderLinks(locale)}
                        <div className={contentOpenClass}>
                            <div>
                                {this.annotations(locale)}
                                {this.userAnnotations()}
                            </div>
                            <div className='content-trans-text-element-data'>
                                {this.references(locale)}
                                {this.openReference()}
                            </div>
                        </div>
                    </div>
                )
        } else {
            return null;
        }
    }
}

