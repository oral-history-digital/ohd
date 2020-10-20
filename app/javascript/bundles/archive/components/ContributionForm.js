import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';
import { Link } from 'react-router-dom';

export default class ContributionForm extends React.Component {

    componentDidMount() {
        this.loadAllPeople();
    }

    componentDidUpdate() {
        this.loadAllPeople();
    }

    loadAllPeople() {
        if (!this.props.peopleStatus.all) {
            this.props.fetchData(this.props, 'people', null, null, 'all');
        }
    }

    formElements() {
        let elements = [
            {
                elementType: 'select',
                attribute: 'person_id',
                values: this.props.people && Object.values(this.props.people),
                value: this.props.contribution && this.props.contribution.person_id,
                withEmpty: true,
                validate: function(v){return v !== ''},
                individualErrorMsg: 'empty'
            },
            {
                elementType: 'select',
                attribute: 'contribution_type',
                values: this.props.contributionTypes && Object.values(this.props.contributionTypes),
                value: this.props.contribution && this.props.contribution.contribution_type,
                optionsScope: 'contributions',
                keepOrder: true,
                withEmpty: true,
                validate: function(v){return v !== ''}
            },
            {
                elementType: 'select',
                attribute: 'workflow_state',
                values: ["unshared", "public"],
                value: this.props.contribution && this.props.contribution.workflow_state,
                optionsScope: 'workflow_states',
            }
        ]
        if (this.props.withSpeakerDesignation) {
            elements.push({
                attribute: 'speaker_designation',
                value: this.props.contribution && this.props.contribution.speaker_designation,
            });
        }
        return elements;
    }

    render() {
        let _this = this;
        return (
            <div>
            <Form
                scope='contribution'
                values={{
                    id: this.props.contribution && this.props.contribution.id,
                    interview_id: this.props.interview && this.props.interview.id
                }}
                onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                elements={this.formElements()}
            />
            <p />
            <Link
                to={`/${this.props.locale}/people`}
                className='admin'
                onClick={() => this.props.closeArchivePopup()}
            >
                {t(_this.props, "edit.person.admin")}
            </Link>
            </div>
        );
    }
}
