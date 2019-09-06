import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class RegisterForm extends React.Component {

    formElements() {
        let conditionsLink; 
        let privacyLink; 
        if (this.props.externalLinks.conditions) {
            conditionsLink = this.props.externalLinks.conditions[this.props.locale];
            privacyLink = this.props.externalLinks.privacy_protection[this.props.locale];
        }

        let firstElements = [
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
                type: 'email',
                validate: function(v){return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)}
            },
            {
                elementType: 'select',
                attribute: 'job_description',
                values: ['researcher', 'filmmaker', 'journalist', 'teacher', 'memorial_staff', 'pupil', 'student', 'other'],
                withEmpty: true,
            },
            {
                elementType: 'select',
                attribute: 'research_intentions',
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
            }
        ];

        let addressElements = [
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
            }
        ];

        let otherElements = [
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
                label: t(this.props, 'user_registration.notes_on_tos_agreement'),
                type: 'checkbox',
                validate: function(v){return v !== false && v !== '0'},
                help: (
                    <a href={conditionsLink} target="_blank" title="Externer Link" rel="noopener">
                        {t(this.props, 'user_registration.tos_agreement')}
                    </a>
                )
            },
            {
                elementType: 'input',
                attribute: 'priv_agreement' ,
                label: t(this.props, 'user_registration.notes_on_priv_agreement'),
                type: 'checkbox',
                validate: function(v){return v !== false && v !== '0'},
                help: (
                    <a href={privacyLink} target="_blank" title="Externer Link" rel="noopener">
                        {t(this.props, 'user_registration.priv_agreement')}
                    </a>
                )
            },
        ];

        if (this.props.projectId === 'mog') {
            return firstElements.concat(otherElements);
        } else {
            return firstElements.concat(addressElements).concat(otherElements);
        }
    }

    render() {
        let _this = this;
        return (
            <Form 
                scope='user_registration'
                onSubmit={function(params){_this.props.submitRegister(`/${_this.props.projectId}/${_this.props.locale}/user_registrations`, params)}}
                submitText='user_registration.register'
                elements={this.formElements()}
            />
        );
    }
}
