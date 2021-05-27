import { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default class PhotoForm extends Component {
    elements() {
        let elements = [
            {
                attribute: 'public_id',
            },
            {
                attribute: 'caption',
                multiLocale: true,
            },
            {
                attribute: 'place',
                multiLocale: true,
            },
            {
                attribute: 'date',
                multiLocale: true,
            },
            {
                attribute: 'photographer',
                multiLocale: true,
            },
            {
                attribute: 'license',
                multiLocale: true,
            },
        ]

        if (this.props.photo?.id) {
            elements.push({
                elementType: 'select',
                attribute: 'workflow_state',
                values: Object.values(this.props.photo.workflow_states),
                value: this.props.photo.workflow_state,
                optionsScope: 'workflow_states',
            })
        }

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
        const { submitData, onSubmit } = this.props;

        return (
            <Form
                scope='photo'
                onSubmit={(params) => {
                    submitData(this.props, params);
                    if (onSubmit) {
                        onSubmit();
                    }
                }}
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
    onSubmit: PropTypes.func,
};
