import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class PhotoForm extends React.Component {

    elements() {
        let elements = [
            {
                attribute: 'caption',
                value: this.props.photo && this.props.photo.captions && this.props.photo.captions[this.props.locale]
            },
            {
                elementType: 'select',
                attribute: 'workflow_state',
                values: this.props.photo && Object.values(this.props.photo.transitions_to),
                optionsScope: 'workflow_states',
                withEmpty: true,
            },
        ]

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
                values={{
                    interview_id: this.props.interview && this.props.interview.id,
                    id: this.props.photo.id
                }}
                elements={this.elements()}
            />
        );
    }
}
