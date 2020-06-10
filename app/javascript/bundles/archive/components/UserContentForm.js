import React from 'react';
import { t } from '../../../lib/utils';
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

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({[name]: value});
        if (this.valid()) {
            this.clearErrors();
        }
    }

    toggleValue(event) {
        const name = event.target.name;
        this.setState({[name]: !this.state[name]});
    }


    handleSubmit(event) {
        event.preventDefault();
        if (this.valid()) {
            this.props.submitData(this.props, {user_content: this.state});
            this.props.closeArchivePopup();
        } else {
            this.setErrors();
        }
    }

    valid() {
        return this.state.title &&
            this.state.title.length > 1
    }

    setErrors() {
        this.setState({errors: t(this.props, 'user_content_errors')});
    }

    clearErrors() {
        this.setState({errors: undefined});
    }

    segmentTime() {
        return moment.utc(this.props.sortedSegments[this.state.segmentIndex].time * 1000).format("HH:mm:ss");
    }

    segmentTape() {
        return this.props.sortedSegments[this.state.segmentIndex].tape_nbr;
    }

    segmentSelect() {
        if (this.state.type === 'UserAnnotation' && this.props.segment) {
            return <div>
                <div className='popup-segment-nav-container'>
                    <div className='popup-segment-nav-label'>
                        {t(this.props, 'segment')}
                    </div>
                    <div className='popup-segment-nav'>
                        {this.previousSegment()}
                        <div className='popup-segment-nav-data'>
                            {`${this.segmentTape()} - ${this.segmentTime()}`}
                        </div>
                        {this.nextSegment()}
                    </div>
                </div>
                <div className='popup-segment-nav-container'>
                    <div className='popup-segment'>
                        {this.props.sortedSegments[this.state.segmentIndex].text[`${this.props.locale}-public`]}
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
        if (this.state.segmentIndex < this.props.sortedSegments.length - 1) {
            return <i className='fa fa-arrow-right popup-segment-nav-after'
                      onClick={() => this.setSegment(this.state.segmentIndex + 1)}/>
        } else {
            return <i className='fa fa-arrow-right popup-segment-nav-after inactive'/>
        }
    }

    setSegment(segmentIndex) {
        let segment = this.props.sortedSegments[segmentIndex];
        this.setState({
            segmentIndex: segmentIndex,
            properties: {
                time: segment.time,
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
                <input className={'publish-input'} type='checkbox' name='publish' checked={this.state.publish}
                       onChange={this.toggleValue}/>
            </div>
        }
    }

    label(term) {
        return <label className={'publish-label'}>
            {t(this.props, term)}
        </label>
    }

    annotationConfirmation() {
        if (this.state.type === 'UserAnnotation') {
            if (this.props.locale && this.props.project.external_links) {
                let guidelines = Object.values(this.props.project.external_links).filter(link => link.internal_name === 'annotation_guidelines')[0] || {};
                let link = Object.values(guidelines.translations).filter(link => link.locale === this.props.locale)[0]
                return <div className={'annotation-confirmation-text'}
                            dangerouslySetInnerHTML={{__html: t(this.props, 'annotation_confirmation', {link: link.url})}}>
                </div>
            }
        }
    }


    render() {
        let submitLabel = this.props.submitLabel ? this.props.submitLabel : t(this.props, 'save');
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
