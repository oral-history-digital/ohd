import React from 'react';
import Form from '../containers/form/Form';
import ContributionFormContainer from '../containers/ContributionFormContainer';
import { t, fullname } from '../../../lib/utils';

export default class InterviewForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showForm: true
        };
        this.returnToForm = this.returnToForm.bind(this);
        this.showContribution = this.showContribution.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    returnToForm() {
        this.setState({showForm: true});
    }

    showContribution(value) {
        return (
            <span>
                <span>{fullname(this.props, this.props.people[parseInt(value.person_id)]) + ', '}</span>
                <span>{t(this.props, `contributions.${value.contribution_type}`) + ', '}</span>
            </span>
        )
    }

    onSubmit(params){
        this.setState({showForm: false});
        this.props.submitData(this.props, params);
        //if (typeof this.props.onSubmitCallback === "function") {this.props.onSubmitCallback()}
    }

    form() {
        let elements = [
            { 
                attribute: 'archive_id',
                value: this.props.interview && this.props.interview.archive_id,
                validate: function(v){return /^[A-z]{2,3}\d{3,4}$/.test(v)},
            },
            { 
                attribute: 'interview_date',
                value: this.props.interview && this.props.interview.interview_date,
                elementType: 'input',
            },
            { 
                attribute: 'media_type',
                value: this.props.interview && this.props.interview.media_type,
                optionsScope: 'search_facets',
                elementType: 'select',
                values: ['video', 'audio']
            },
            {
                elementType: 'select',
                attribute: 'language_id',
                values: this.props.languages,
                value: this.props.interview && this.props.interview.language_id,
                withEmpty: true,
                validate: function(v){return /^\d+$/.test(v)},
            },
            {
                elementType: 'select',
                attribute: 'collection_id',
                values: this.props.collections,
                value: this.props.interview && this.props.interview.collection_id,
                withEmpty: true,
                validate: function(v){return /^\d+$/.test(v)},
                individualErrorMsg: 'empty'
            },
            { 
                // tape_count is important to calculate the video-path
                attribute: 'tape_count',
                value: this.props.interview && this.props.interview.tape_count,
                elementType: 'input',
                validate: function(v){return /^\d+$/.test(v)}
            },
            { 
                attribute: 'observations',
                value: this.props.interview && this.props.interview.observations && this.props.interview.observations[this.props.locale],
                elementType: 'textarea',
            },
            // { 
            //     attribute: 'translated',
            //     value: this.props.interview && this.props.interview.translated,
            //     elementType: 'input',
            //     type: 'checkbox'
            // },
        ]

        if (this.props.interview) {
            elements.push(
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: this.props.interview && Object.values(this.props.interview.workflow_states),
                    value: this.props.interview.workflow_state,
                    optionsScope: 'workflow_states',
                }
            )
        }

        let props = {
            scope: 'interview',
            values: {
                id: this.props.interview && this.props.interview.archive_id,
                project_id: this.props.project.id
            },
            //data: this.props.interview,
            onSubmit: this.onSubmit,
            submitText: this.props.submitText,
            elements: elements
        }

        if (this.props.withContributions) {
            props['subForm'] = ContributionFormContainer;
            props['subFormProps'] = {};
            props['subFormScope'] = 'contribution';
            props['subScopeRepresentation'] = this.showContribution;
        }

        return React.createElement(Form, props)
    }

    render() {
        if (this.state.showForm) {
            return this.form();
        } else {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.interview.processing')}
                    </p>
                    <button 
                        className='return-to-upload'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.interview.edit')}
                    </button>
                </div>
            )
        }
    }

}
