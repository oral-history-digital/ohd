import React from 'react';

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
            type: this.props.type
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            id: nextProps.id,
            title: nextProps.title,
            description: nextProps.description,
            properties: nextProps.properties,
            reference_id: nextProps.reference_id,
            reference_type: nextProps.reference_type,
            media_id: nextProps.mediaId,
            type: nextProps.type
        })
    }

    handleChange(event) {
        const value =  event.target.value;
        const name =  event.target.name;

        this.setState({[name]: value});
        if(this.valid()) {
            this.clearErrors();
        }
    }


    handleSubmit(event) {
        event.preventDefault();
        if(this.valid()) {
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
        this.setState({ errors: "Please give at least two chars in title and description." })
    }

    clearErrors() {
        this.setState({ errors: undefined })
    }

    render() {
        return (
            <div>
                <div className='errors'>{this.state.errors}</div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        title
                        <input type="text" name='title' value={this.state.title} onChange={this.handleChange} />
                    </label>
                    <label>
                        description
                        <textarea name='description' value={this.state.description} onChange={this.handleChange} />
                    </label>
                    
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}
