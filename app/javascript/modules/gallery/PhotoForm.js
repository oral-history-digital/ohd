import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default class PhotoForm extends React.Component {
    elements() {
        let elements = [
            {
                attribute: 'caption',
                multiLocale: true,
            },
            {
                elementType: 'select',
                attribute: 'workflow_state',
                values: this.props.photo && Object.values(this.props.photo.workflow_states),
                value: this.props.photo && this.props.photo.workflow_state,
                optionsScope: 'workflow_states',
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
        return (
            <Form
                scope='photo'
                onSubmit={(params) => {this.props.submitData(this.props, params); this.props.closeArchivePopup()}}
                data={this.props.photo}
                values={{
                    interview_id: this.props.interview && this.props.interview.id,
                    id: this.props.photo && this.props.photo.id
                }}
                elements={this.elements()}
            />
        );
    }
}

PhotoForm.propTypes = {
    interview: PropTypes.object,
    photo: PropTypes.object,
    withUpload: PropTypes.bool,
    submitData: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
};
