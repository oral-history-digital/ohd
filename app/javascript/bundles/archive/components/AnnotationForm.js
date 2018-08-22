import React from 'react';
import Form from '../containers/form/Form';

export default class AnnotationForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='annotation'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                values={{
                    id: this.props.annotation && this.props.annotation.id,
                    segment_id: this.props.segment.id,
                    interview_id: this.props.segment.interview_id
                }}
                submitText='submit'
                elements={[
                    {
                        elementType: 'textarea',
                        attribute: 'text',
                        value: this.props.annotation && this.props.annotation.text[this.props.locale],
                        validate: function(v){return v.length > 1} 
                    },
                ]}
            />
        );
    }
}
