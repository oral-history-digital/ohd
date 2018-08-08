import React from 'react';
import Form from '../containers/form/Form';

export default class SegmentForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='segment'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                values={{
                    id: this.props.segment && this.props.segment.id
                }}
                submitText='submit'
                elements={[
                    {
                        elementType: 'textarea',
                        attribute: 'text',
                        value: this.props.segment && this.props.segment.transcripts[this.props.locale],
                        validate: function(v){return v.length > 1} 
                    },
                ]}
            />
        );
    }
}
