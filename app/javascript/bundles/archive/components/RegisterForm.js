import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class RegisterForm extends React.Component {

    render() {
        let conditionsLink; 
        let privacyLink; 
        if (this.props.externalLinks.conditions) {
            conditionsLink = this.props.externalLinks.conditions[this.props.locale];
            privacyLink = this.props.externalLinks.privacy_protection[this.props.locale];
        }

        return (
            <Form 
                scope='user_registration'
                onSubmit={this.props.submitRegister}
                submitText='user_registration.register'
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'appellation',
                        values: ['ms', 'ms_dr', 'ms_prof', 'mr', 'mr_dr', 'mr_prof'],
                        withEmpty: true,
                        validate: function(v){return v !== ''} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'first_name',
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'last_name',
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'email',
                        type: 'text',
                        validate: function(v){return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)}
                    },
                    {
                        elementType: 'select',
                        attribute: 'job_description',
                        values: ['researcher', 'filmmaker', 'journalist', 'teacher', 'memorial_staff', 'pupil', 'student', 'other'],
                        withEmpty: true,
                    },
                    {
                        elementType: 'select',
                        attribute: 'research_intention',
                        values: ['exhibition', 'education', 'film', 'genealogy', 'art', 'personal_interest', 'press_publishing', 'school_project', 'university_teaching', 'scientific_paper', 'other'],
                        withEmpty: true,
                    },
                    {
                        elementType: 'textarea',
                        attribute: 'comments',
                        validate: function(v){return v.length > 10} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'organization',
                        type: 'text',
                    },
                    {
                        elementType: 'input',
                        attribute: 'homepage',
                        type: 'text',
                    },
                    {
                        elementType: 'input',
                        attribute: 'street',
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'zipcode',
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'city',
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'select',
                        attribute: 'country',
                        optionsScope: 'countries',
                        values: this.props.country_keys && this.props.country_keys[this.props.locale],
                        withEmpty: true,
                        validate: function(v){return v !== ''} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'tos_agreement',
                        label: 'user_registration.notes_on_tos_agreement',
                        type: 'checkbox',
                        validate: function(v){return v !== false && v !== '0'},
                        help: (
                            <a href={conditionsLink} target="_blank" title="Externer Link">
                                {t(this.props, 'user_registration.tos_agreement')}
                            </a>
                        )
                    },
                    {
                        elementType: 'input',
                        attribute: 'priv_agreement' ,
                        label: 'user_registration.notes_on_priv_agreement',
                        type: 'checkbox',
                        validate: function(v){return v !== false && v !== '0'},
                        help: (
                            <a href={privacyLink} target="_blank" title="Externer Link">
                                {t(this.props, 'user_registration.priv_agreement')}
                            </a>
                        )
                    },
                ]}
            />
        );
    }
}
