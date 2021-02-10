import React from 'react';
import { Link } from 'react-router-dom';

import { Form } from 'modules/forms';
import { ContributionFormContainer } from 'modules/interview-metadata';
import { fullname } from 'lib/utils';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';

export default class InterviewForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showForm: true,
            archiveId: null
        };
        this.returnToForm = this.returnToForm.bind(this);
        this.setArchiveId = this.setArchiveId.bind(this);
        this.showContribution = this.showContribution.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    returnToForm() {
        this.setState({showForm: true});
    }

    setArchiveId(name, value) {
        this.setState({archiveId: value})
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
        let _this = this;
        let elements = [
            {
                attribute: 'archive_id',
                value: this.props.interview && this.props.interview.archive_id,
                handlechangecallback: this.setArchiveId,
                validate: function(v){
                    let regexp = new RegExp(`^${_this.props.project.initials}\\d{${_this.props.project.archive_id_number_length}}$`);
                    return regexp.test(v);
                },
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
                withEmpty: true,
                values: ['video', 'audio'],
                validate: function(v){return /^\w+$/.test(v)},
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
                project_id: this.props.project.id
            },
            data: this.props.interview,
            onSubmit: this.onSubmit,
            submitText: this.props.submitText,
            elements: elements
        }

        if (this.props.withContributions) {
            props['nestedForm'] = ContributionFormContainer;
            props['nestedFormProps'] = {withSpeakerDesignation: true};
            props['nestedFormScope'] = 'contribution';
            props['nestedScopeRepresentation'] = this.showContribution;
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
                    <p>
                        <Link
                            to={pathBase(this.props) + '/interviews/' + this.state.archiveId}>
                            {t(this.props,  'edit.interview.edit')}
                        </Link>
                    </p>
                    <button
                        className='return-to-form'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.interview.return')}
                    </button>
                </div>
            )
        }
    }

}
