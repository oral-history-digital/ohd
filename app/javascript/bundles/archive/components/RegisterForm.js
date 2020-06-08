import React from 'react';
import Form from '../containers/form/Form';
import { t, pathBase } from '../../../lib/utils';

export default class RegisterForm extends React.Component {

    formElements() {
        let conditionsLink = Object.values(this.props.externalLinks).filter(link => link.internal_name === 'conditions')[0];
        let privacyLink = Object.values(this.props.externalLinks).filter(link => link.internal_name === 'privacy_protection')[0];
        conditionsLink =  (conditionsLink && conditionsLink.url) || {}
        privacyLink =  (privacyLink && privacyLink.url) || {}

        let firstElements = [
            {
                elementType: 'select',
                attribute: 'appellation',
                values: ['dr', 'prof'],
                keepOrder: true,
                withEmpty: true,
            },
            {
                elementType: 'input',
                attribute: 'first_name',
                type: 'text',
                validate: function(v){return v && v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'last_name',
                type: 'text',
                validate: function(v){return v && v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'email',
                type: 'email',
                validate: function(v){return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)}
            },
            {
                elementType: 'select',
                attribute: 'gender',
                values: ['female', 'male', 'diverse', 'not_specified'],
                keepOrder: true,
                withEmpty: true,
                validate: function(v){return v !== ''}
            },
            {
                elementType: 'select',
                attribute: 'job_description',
                values: ['researcher', 'filmmaker', 'journalist', 'teacher', 'memorial_staff', 'pupil', 'student', 'other'],
                keepOrder: true,
                withEmpty: true,
            },
            {
                elementType: 'select',
                attribute: 'research_intentions',
                values: ['exhibition', 'education', 'film', 'genealogy', 'art', 'personal_interest', 'press_publishing', 'school_project', 'university_teaching', 'scientific_paper', 'other'],
                keepOrder: true,
                withEmpty: true,
            },
            {
                elementType: 'textarea',
                attribute: 'comments',
                validate: function(v){return v && v.length > 10}
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
                validate: function(v){return v && v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'zipcode',
                type: 'text',
                validate: function(v){return v && v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'city',
                type: 'text',
                validate: function(v){return v && v.length > 1}
            }
        ];

        let countrySelect = [
            {
                elementType: 'select',
                attribute: 'country',
                optionsScope: 'countries',
                values: this.props.countryKeys && this.props.countryKeys[this.props.locale],
                withEmpty: true,
                validate: function(v){return v !== ''}
            },
        ];

        let newsletterElement = [
            {
                elementType: 'input',
                attribute: 'receive_newsletter',
                type: 'checkbox',
                help: 'user_registration.notes_on_receive_newsletter'
            },
        ];

        let otherElements = [
            {
                elementType: 'input',
                attribute: 'tos_agreement',
                labelKey: 'user_registration.tos_agreement',
                type: 'checkbox',
                validate: function(v){return v !== false && v !== '0'},
                help: (
                    <a href={conditionsLink[this.props.locale]} target="_blank" title="Externer Link" rel="noopener">
                        {t(this.props, 'user_registration.notes_on_tos_agreement')}
                    </a>
                )
            },
            {
                elementType: 'input',
                attribute: 'priv_agreement' ,
                labelKey: 'user_registration.priv_agreement',
                type: 'checkbox',
                validate: function(v){return v !== false && v !== '0'},
                help: (
                    <a href={privacyLink[this.props.locale]} target="_blank" title="Externer Link" rel="noopener">
                        {t(this.props, 'user_registration.notes_on_priv_agreement')}
                    </a>
                )
            },
        ];

        if (this.props.projectId === 'mog') {
            return firstElements.concat(countrySelect).concat(otherElements);
        } else if (this.props.locale === 'de') {
            return firstElements.concat(addressElements).concat(countrySelect).concat(newsletterElement).concat(otherElements);
        } else {
            return firstElements.concat(addressElements).concat(countrySelect).concat(otherElements);
        }
    }

    render() {
        let _this = this;
        return (
            <Form
                scope='user_registration'
                onSubmit={function(params){_this.props.submitRegister(`${pathBase(_this.props)}/user_registrations`, params)}}
                submitText='user_registration.register'
                elements={this.formElements()}
            />
        );
    }
}
