import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class ContributionForm extends React.Component {

    componentDidMount() {
        //if (admin(this.props, {type: 'Contribution', action: 'create'})) {
            this.loadAllPeople();
        //}
    }

    componentDidUpdate() {
        //if (admin(this.props, {type: 'Contribution', action: 'create'})) {
            this.loadAllPeople();
        //}
    }

    loadAllPeople() {
        if (!this.props.peopleStatus.all) {
            this.props.fetchData('people');
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
                withEmpty: true,
                validate: function(v){return v !== ''} 
            },
        ]
        if (this.props.withSpeakerDesignation) {
            elements.push({ 
                attribute: 'speaker_designation',
            });
        }
        return elements;
    }

    render() {
        let _this = this;
        return (
            <Form 
                scope='contribution'
                values={{
                    id: this.props.contribution && this.props.contribution.id,
                    interview_id: this.props.interview && this.props.interview.id
                }}
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                elements={this.formElements()}
            />
        );
    }
}
