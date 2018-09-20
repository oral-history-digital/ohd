import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class PhotoForm extends React.Component {

    elements() {
        let elements = [{
            attribute: 'caption',
            value: this.props.photo && this.props.photo.caption && this.props.photo.caption[this.props.locale]
        }]

        if (this.props.withUpload) {
            elements.push({ 
                attribute: 'data',
                elementType: 'input',
                type: 'file',
                validate: function(v){return v instanceof File},
            })
        }

        return elements;
    }

    render() {
        let _this = this;
        return (
            <Form 
                scope='photo'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                submitText='edit.photo.photo'
                values={{interview_id: this.props.interview && this.props.interview.id}}
                elements={this.elements()}
            />
        );
    }
}
