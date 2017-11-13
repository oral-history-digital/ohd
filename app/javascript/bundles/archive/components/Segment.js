import React from 'react';
import UserContentFormContainer from '../containers/UserContentFormContainer';
import '../../../css/segments';

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
        if ((this.state.contentOpen != nextState.contentOpen) || (this.state.contentType != nextState.contentType) ) {
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
        let locale = this.props.originalLocale ? this.props.interview.lang : this.props.locale
        return this.props.data.transcripts[locale.substring(0,2)]
    }

    userContentForm() {
        return <UserContentFormContainer
            title=''
            description=''
            properties={{
                time: this.props.data.start_time,
                interview_archive_id: this.props.interview.archive_id
            }}
            reference_id={this.props.data.id}
            reference_type='Segment'
            media_id={this.props.data.media_id}
            type='UserAnnotation'
            workflow_state='private'
        />
    }


    toggleAdditionalContent(type) {
        let state = this.state.contentOpen;

        let newState = type != this.state.contentType ? true : !state;

        this.setState({
            contentOpen: newState,
            contentType: type
        });
    }


    references(locale){
        if (this.state.contentType == 'references'){
            return this.props.references.filter(ref => ref.ref_object_id === this.props.data.id).map((reference, index) => {
                return <p className='content-trans-text-element-data'
                          key={"reference-" + index}>{reference.desc[locale]}</p>
            })
        }
    }

    annotations(locale){
        if (this.state.contentType == 'annotations'){
            return  this.props.data.annotation_texts.map((annotation, index) => {
                return <p className='content-trans-text-element-data'
                          key={"annotation-" + index}>{annotation}</p>
            })
        }
    }



    render() {
        let locale = this.props.originalLocale ? this.props.interview.lang.substring(0,2) : this.props.locale;
        let annotionCss = this.props.data.annotation_texts.length > 0 ? 'content-trans-text-ico-link' : 'hidden';
        let referenceCss = this.props.data.references_count > 0 ? 'content-trans-text-ico-link' : 'hidden';
        let icoCss = this.state.contentOpen ? 'content-trans-text-ico active': 'content-trans-text-ico';
        let contentOpenClass = this.state.contentOpen ? 'content-trans-text-element' : 'hidden';

        return (
            <div className={'content-trans-row'}>
                <div>
                    <div className="content-trans-speaker-ico"
                         onClick={() => this.props.handleSegmentClick(this.props.data.time)}>
                        <div className="content-trans-speaker-link" title="Interviewer">
                            <i className="fa fa-user-o"></i>
                        </div>
                    </div>
                    <div className='content-trans-text'
                         onClick={() => this.props.handleSegmentClick(this.props.data.time)}>
                        <div className={this.css()}
                             dangerouslySetInnerHTML = {{__html:this.transcript()}}
                        />
                    </div>
                    <div className={icoCss}>
                        <div className="content-trans-text-ico-link" title="Anmerkung schreiben"
                             onClick={() => this.props.openArchivePopup({
                                 title: 'Add Annotation',
                                 content: this.userContentForm()
                             })}>
                            <i className="fa fa-pencil-square-o"></i>
                        </div>
                        <div className={annotionCss} title="Anmerkungen lesen"
                             onClick={() => this.toggleAdditionalContent('annotations')}><i className="fa fa-sticky-note-o"></i>
                        </div>
                        <div className={referenceCss} title="Schlagworte"
                             onClick={() => this.toggleAdditionalContent('references')}><i className="fa fa-tag"></i></div>
                    </div>
                    <div className={contentOpenClass}>
                        <div>
                            {this.annotations(locale)}
                        </div>
                        <div>
                            {this.references(locale)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

