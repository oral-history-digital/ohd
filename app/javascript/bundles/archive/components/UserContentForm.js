import React from 'react';
import ArchiveUtils from '../../../lib/utils';

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
            workflow_state: this.props.workflow_state,
            publish: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            this.state.title.length > 2 &&
            this.state.description &&
            this.state.description.length > 2
    }

    setErrors() {
        this.setState({errors: "Please give at least two chars in title and description."})
    }

    clearErrors() {
        this.setState({errors: undefined})
    }

    publish() {
        if (this.state.type === 'UserAnnotation' && this.state.workflow_state === 'private') {
            return  <div className={"form-group"}>
                        <label>
                            publish
                            <input type='checkbox' name='publish' checked={this.state.publish} onChange={this.handleChange}/>
                        </label>
                    </div>
        }
    }

    render() {
        let submitLabel = this.props.submitLabel ? this.props.submitLabel : "Submit";
        return (
            <div>
                <div className='errors'>{this.state.errors}</div>
                <form className='default' onSubmit={this.handleSubmit}>
                    <div className={"form-group"}>
                        <label>
                            {ArchiveUtils.translate(this.props, 'title')}
                        </label>
                        <input type="text" name='title' value={this.state.title} onChange={this.handleChange}/>
                    </div>
                    <div className={"form-group"}>
                        <label>
                            {ArchiveUtils.translate(this.props, 'description')}
                        </label>
                        <textarea name='description' value={this.state.description} onChange={this.handleChange}/>
                    </div>
                    {this.publish()}
                    <input type="submit" value={submitLabel}/>
                </form>
            </div>
        );
    }
}
