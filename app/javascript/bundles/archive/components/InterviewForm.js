import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class InterviewForm extends React.Component {

    render() {
        return (
            <Form 
                scope='interview'
                onSubmit={this.props.submitInterview}
                submitText={this.props.submitText}
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'collection_id',
                        values: this.props.collections,
                        selected: this.props.interview && this.props.interview.collection_id,
                        withEmpty: true,
                        validate: function(v){return v !== ''},
                        individualErrorMsg: 'empty'
                    },
                    { 
                        attribute: 'archive_id',
                        value: this.props.interview && this.props.interview.archive_id,
                        validate: function(v){return /^[A-z]{2}\d{3}$/.test(v)}
                    },
                    {
                        elementType: 'select',
                        attribute: 'language_id',
                        values: this.props.languages,
                        selected: this.props.interview && this.props.interview.language_id,
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
                        attribute: 'video',
                        defaultChecked: this.props.interview && this.props.interview.media_type.toLowerCase() === 'video',
                        elementType: 'input',
                        type: 'checkbox'
                    },
                    { 
                        attribute: 'translated',
                        defaultChecked: this.props.interview && this.props.interview.translated,
                        elementType: 'input',
                        type: 'checkbox'
                    },
                ]}
            />
        );
    }
}
