import React from 'react';
import RichTextEditor from 'react-rte';
import { t } from '../../../lib/utils';
//import Form from '../containers/form/Form';

export default class AnnotationForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            values: {
                id: this.props.annotation && this.props.annotation.id,
                segment_id: this.props.segment.id,
                interview_id: this.props.segment.interview_id,
                text: this.props.annotation && this.props.annotation.text[this.props.locale] ? 
                      RichTextEditor.createValueFromString(this.props.annotation.text[this.props.locale], 'html') : 
                      RichTextEditor.createEmptyValue()
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(value) {
        this.setState({ 
            values: Object.assign({}, this.state.values, {text: value})
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        let preparedValues = this.state.values;
        preparedValues.text = this.state.values.text.toString('html');
        this.props.submitData({annotation: preparedValues}, this.props.locale);
        this.props.closeArchivePopup();
    }

    render () {
        return (
            <form 
                id='annotation' 
                className='annotation default' 
                onSubmit={this.handleSubmit}
            >
                <RichTextEditor
                    value={this.state.values.text}
                    onChange={this.handleChange}
                />
                <input type="submit" value={t(this.props, 'submit')}/>
            </form>
        );
    }

    //render() {
        //let _this = this;
        //return (
            //<Form 
                //scope='annotation'
                //onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                //values={{
                    //id: this.props.annotation && this.props.annotation.id,
                    //segment_id: this.props.segment.id,
                    //interview_id: this.props.segment.interview_id
                //}}
                //submitText='submit'
                //elements={[
                    //{
                        //elementType: 'textarea',
                        //attribute: 'text',
                        //value: this.props.annotation && this.props.annotation.text[this.props.locale],
                        //validate: function(v){return v.length > 1} 
                    //},
                //]}
            ///>
        //);
    //}
}
