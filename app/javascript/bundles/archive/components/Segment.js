import React from 'react';
import ArchiveUtils from "../../../lib/utils";

export default class Segment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false,
            contentOpen: false,
            contentType: 'none'
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((this.state.contentOpen != nextState.contentOpen) || (this.state.contentType != nextState.contentType)) {
            return true;
        }

        let changingToActive = !this.state.active && this.props.data.end_time >= nextProps.transcriptTime && this.props.data.start_time <= nextProps.transcriptTime;
        let changingToInactive = this.state.active && (this.props.data.end_time < nextProps.transcriptTime || this.props.data.start_time > nextProps.transcriptTime);
        return changingToActive || changingToInactive
    }

    componentWillReceiveProps(nextProps) {
        let active = this.props.data.end_time >= nextProps.transcriptTime && this.props.data.start_time <= nextProps.transcriptTime;
        if (active !== this.state.active) {
            this.setState({
                active: active
            })
        }
    }

    css() {
        //let active = this.props.data.end_time >= this.props.transcriptTime && this.props.data.start_time <= this.props.transcriptTime; 
        return 'segment ' + (this.state.active ? 'active' : 'inactive');
    }

    transcript() {
        let locale = this.props.originalLocale ? this.props.interview.lang : 'de'
        return this.props.data.transcripts[locale.substring(0, 2)]
    }

    toggleAdditionalContent(type) {
        let state = this.state.contentOpen;

        let newState = type != this.state.contentType ? true : !state;

        this.setState({
            contentOpen: newState,
            contentType: type
        });
    }

    references(locale) {
        if (this.state.contentType == 'references') {
            //return this.props.references.filter(ref => ref.ref_object_id === this.props.data.id).map((reference, index) => {
            return this.props.data.references.map((reference, index) => {
                return <span key={"reference-" + index}>{reference.desc[locale]}</span>
            })
        }
    }

    annotations(locale) {
        if (this.state.contentType == 'annotations') {
            return this.props.data.annotation_texts.map((annotation, index) => {
                return <p className='content-trans-text-element-data'
                          key={"annotation-" + index}>{annotation}</p>
            })
        }
    }

    speakerName(){
        let name = "";
        if (this.props.data.speaker_id){
            let id = this.props.data.speaker_id;
            let locale = this.props.locale;
            let speaker = this.props.interview.person_names[id];
            if (speaker) {
                name = `${speaker[locale].firstname} ${speaker[locale].lastname}`
            }
        }
        return name;
    }

    speakerIcon() {
        if (this.props.data.speaker_changed) {
            let speakerCss = this.props.data.speaker_is_interviewee ? "fa fa-user" : "fa fa-user-o";
            let title = this.speakerName();
            return (
                <div className="content-trans-speaker-link" title={title}
                     onClick={() => this.props.handleSegmentClick(this.props.tape, this.props.data.time)}>
                    <i className={speakerCss}></i>
                </div>
            )
        }
    }

    renderLinks() {
        if (this.props.data.annotation_texts.length > 0 || this.props.data.references.length > 0) {

            let icoCss = this.state.contentOpen ? 'content-trans-text-ico active' : 'content-trans-text-ico';
            let annotionCss = this.props.data.annotation_texts.length > 0 ? 'content-trans-text-ico-link' : 'hidden';
            let referenceCss = this.props.data.references.length > 0 ? 'content-trans-text-ico-link' : 'hidden';
            return (
                <div className={icoCss}>
                    <div className={annotionCss} title={ArchiveUtils.translate(this.props, 'annotations')}
                         onClick={() => this.toggleAdditionalContent('annotations')}><i
                        className="fa fa-sticky-note-o"></i>
                    </div>
                    <div className={referenceCss} title={ArchiveUtils.translate(this.props, 'keywords')}
                         onClick={() => this.toggleAdditionalContent('references')}><i className="fa fa-tag"></i>
                    </div>
                </div>
            )
        }
    }

    render() {
        let locale = this.props.originalLocale ? this.props.interview.lang.substring(0, 2) : this.props.locale;
        let contentOpenClass = this.state.contentOpen ? 'content-trans-text-element' : 'hidden';
        let contentTransRowCss = this.props.data.speaker_changed ? 'content-trans-row speaker-change' : 'content-trans-row';

        return (
            <div className={contentTransRowCss}>
                <div>
                    <div className="content-trans-speaker-ico">
                        {this.speakerIcon()}
                    </div>
                    <div className='content-trans-text'
                         onClick={() => this.props.handleSegmentClick(this.props.tape, this.props.data.time)}>
                        <div className={this.css()}
                             dangerouslySetInnerHTML={{__html: this.transcript()}}
                        />
                    </div>
                    {this.renderLinks()}
                    <div className={contentOpenClass}>
                        <div>
                            {this.annotations(locale)}
                        </div>
                        <div className='content-trans-text-element-data'>
                            {this.references(locale)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

