import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class InterviewForm extends React.Component {

    render() {
        return (
            <Form 
                scope='interview'
                values={{
                    id: this.props.interview && this.props.interview.archive_id
                }}
                onSubmit={this.props.submitData}
                submitText={this.props.submitText}
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'collection_id',
                        values: this.props.collections,
                        value: this.props.interview && this.props.interview.collection_id,
                        withEmpty: true,
                        validate: function(v){return v !== ''},
                        individualErrorMsg: 'empty'
                    },
                    { 
                        attribute: 'archive_id',
                        value: this.props.interview && this.props.interview.archive_id,
                        validate: function(v){return /^[A-z]{2,3}\d{3}$/.test(v)}
                    },
                    {
                        elementType: 'select',
                        attribute: 'language_id',
                        values: this.props.languages,
                        value: this.props.interview && this.props.interview.language_id,
                        withEmpty: true,
                        validate: function(v){return v !== ''} 
                    },
                    { 
                        attribute: 'interview_date',
                        value: this.props.interview && this.props.interview.interview_date,
                        elementType: 'input',
                        type: 'date'
                    },
                    { 
                        attribute: 'observations',
                        value: this.props.interview && this.props.interview.observations && this.props.interview.observations[this.props.locale],
                        elementType: 'textarea',
                    },
                    { 
                        attribute: 'video',
                        value: this.props.interview && this.props.interview.media_type.toLowerCase() === 'video',
                        elementType: 'input',
                        type: 'checkbox'
                    },
                    { 
                        attribute: 'translated',
                        value: this.props.interview && this.props.interview.translated,
                        elementType: 'input',
                        type: 'checkbox'
                    },
                    {
                        elementType: 'select',
                        attribute: 'workflow_state',
                        values: this.props.interview && Object.values(this.props.interview.transitions_to),
                        optionsScope: 'workflow_states',
                        withEmpty: true,
                    },
                ]}
            />
        );
    }
}
