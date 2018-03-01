import React from 'react';
import ArchiveUtils from '../../../lib/utils';
import moment from 'moment';

export default class UserContentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            title: this.props.title,
            description: this.props.description,
            properties: this.props.properties,
            reference_id: this.props.reference_id,
            reference_type: this.props.reference_type,
            media_id: this.props.media_id,
            type: this.props.type,
            segmentIndex: this.props.segmentIndex,
            workflow_state: this.props.workflow_state,
            publish: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleValue = this.toggleValue.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            id: nextProps.id,
            title: nextProps.title,
            description: nextProps.description,
            properties: nextProps.properties,
            reference_id: nextProps.reference_id,
            reference_type: nextProps.reference_type,
            media_id: nextProps.mediaId,
            segmentIndex: nextProps.segmentIndex,
            type: nextProps.type,
            workflow_state: nextProps.workflow_state,
            publish: false
        })
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({[name]: value});
        if (this.valid()) {
            this.clearErrors();
        }
    }

    toggleValue(event){
        const name = event.target.name;
        this.setState({[name]: !this.state[name]});
    }


    handleSubmit(event) {
        event.preventDefault();
        if (this.valid()) {
            this.props.submitUserContent(this.state);
            this.props.closeArchivePopup();
        } else {
            this.setErrors();
        }
    }

    valid() {
        return this.state.title &&
            this.state.title.length > 1 &&
            this.state.description &&
            this.state.description.length > 1
    }

    setErrors() {
        this.setState({errors: ArchiveUtils.translate(this.props, 'user_content_errors')});
    }

    clearErrors() {
        this.setState({errors: undefined});
    }

    segment() {
        return this.segments()[this.state.segmentIndex];
    }

    segments(){
        return this.props.segments;
    }

    segmentTime() {
        return moment.utc(this.segment().start_time * 1000).format("HH:mm:ss");
    }

    segmentSelect() {
        if (this.state.type === 'UserAnnotation') {
            return <div>
                <div className='popup-segment-nav-container'>
                    <div className='popup-segment-nav-label'>
                        {ArchiveUtils.translate(this.props, 'segment')}
                    </div>
                    <div className='popup-segment-nav'>
                        {this.previousSegment()}
                        <div className='popup-segment-nav-data'>
                            {this.segmentTime()}
                        </div>
                        {this.nextSegment()}
                    </div>
                </div>
                <div className='popup-segment-nav-container'>
                    <div className='popup-segment'>
                        {this.segment().transcripts[this.props.locale]}
                    </div>
                </div>
            </div>
        }
    }

    previousSegment() {
        if (this.state.segmentIndex > 0) {
            return <i className='fa fa-arrow-left popup-segment-nav-before'
                      onClick={() => this.setSegment(this.state.segmentIndex - 1)}/>
        } else {
            return <i className='fa fa-arrow-left popup-segment-nav-before inactive'/>
        }
    }

    nextSegment() {
        if (this.state.segmentIndex < this.segments().length - 1) {
            return <i className='fa fa-arrow-right popup-segment-nav-after'
                      onClick={() => this.setSegment(this.state.segmentIndex + 1)}/>
        } else {
            return <i className='fa fa-arrow-right popup-segment-nav-after inactive'/>
        }
    }

    setSegment(segmentIndex) {
        let segment = this.segments()[segmentIndex];
        this.setState({
            segmentIndex: segmentIndex,
            properties: {
                time: segment.start_time,
                tape_nbr: segment.tape_nbr,
                segmentIndex: segmentIndex,
                interview_archive_id: this.props.archiveId
            },
            reference_id: segment.id,
            media_id: segment.media_id
        });
    }

    publish() {
        if (this.state.type === 'UserAnnotation' && this.state.workflow_state === 'private') {
            return <div className={"form-group"}>
                {this.label('publish')}
                <input className={'publish-input'} type='checkbox' name='publish' checked={this.state.publish} onChange={this.toggleValue}/>
            </div>
        }
    }

    label(term) {
        return <label className={'publish-label'}>
            {ArchiveUtils.translate(this.props, term)}
        </label>
    }

    annotationConfirmation(){
        if (this.state.type === 'UserAnnotation') {
            if (this.props.locale && this.props.externalLinks) {
                let links = this.props.externalLinks;
                let locale = this.props.locale;
                let key = 'conditions';
                let link = links[key][locale];
                return <div className={'annotation-confirmation-text help-block'}>
                    {ArchiveUtils.translate(this.props, 'annotation_confirmation')}
                    <a className={'conditions-link'} href={link}
                       target="_blank">&nbsp;{ArchiveUtils.translate(this.props, key)}
                    </a>
                </div>
            }
        }
    }



    render() {
        let submitLabel = this.props.submitLabel ? this.props.submitLabel : ArchiveUtils.translate(this.props, 'save');
        return (
            <div>
                <div className='errors'>{this.state.errors}</div>
                <form className='default' onSubmit={this.handleSubmit}>
                    <div className={"form-group"}>
                        {this.label('title')}
                        <input type="text" name='title' value={this.state.title} onChange={this.handleChange}/>
                    </div>
                    <div className={"form-group"}>
                        {this.label('description')}
                        <textarea name='description' value={this.state.description} onChange={this.handleChange}/>
                    </div>
                    {this.segmentSelect()}
                    {this.annotationConfirmation()}
                    {this.publish()}
                    <input type="submit" value={submitLabel}/>
                </form>
            </div>
        );
    }
}
