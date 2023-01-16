import { useState } from 'react';
import request from 'superagent';

import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import findExternalLink from '../findExternalLink';

export default function RegisterForm({
    projectId,
    project,
    countryKeys,
    submitRegister,
}) {

    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const conditionsLink = findExternalLink(project, 'conditions');
    const privacyLink = findExternalLink(project, 'privacy_protection');

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const [emailCheckResponse, setEmailCheckResponse] = useState({email_taken: false, msg: null});

    const handleEmailChange = async(name, value) => {
        if (emailRegex.test(value)) {
            fetch(`${pathBase}/accounts/check_email?email=${value}`)
                .then(res => res.json())
                .then(json => setEmailCheckResponse(json));
        }
    }

    const formElements = () => {
        let firstElements = [
            {
                elementType: 'input',
                attribute: 'email',
                type: 'email',
                handlechangecallback: handleEmailChange,
                validate: function(v){return emailRegex.test(v)},
                help: emailCheckResponse.email_taken && (
                    <p className='notifications'>
                        {emailCheckResponse.msg}
                    </p>
                ),
                emailTaken: emailCheckResponse.email_taken,
                validate: function(v, t){return (emailRegex.test(v) && !t)},
                //individualErrorMsg: emailCheckResponse.msg || t('activerecord.errors.default.email_input'),
            },
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
        ];

        let addressElements = [
            {
                elementType: 'input',
                attribute: 'street',
                type: 'text',
                validate: projectId !== 'mog' && function(v){return v && v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'zipcode',
                type: 'text',
            },
            {
                elementType: 'input',
                attribute: 'city',
                type: 'text',
                validate: projectId !== 'mog' && function(v){return v && v.length > 1}
            }
        ];

        let countrySelect = [
            {
                elementType: 'select',
                attribute: 'country',
                optionsScope: 'countries',
                values: countryKeys && countryKeys[locale],
                withEmpty: true,
                validate: projectId !== 'mog' && function(v){return v !== ''}
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
                validate: function(v){return v && v !== '0'},
                help: (
                    <a
                        className="Link"
                        href={conditionsLink[locale]}
                        target="_blank"
                        title="Externer Link"
                        rel="noreferrer">
                        {t('user_registration.notes_on_tos_agreement')}
                    </a>
                )
            },
            {
                elementType: 'input',
                attribute: 'priv_agreement' ,
                labelKey: 'user_registration.priv_agreement',
                type: 'checkbox',
                validate: function(v){return v && v !== '0'},
                help: (
                    <a
                        className="Link"
                        href={privacyLink[locale]}
                        target="_blank"
                        title="Externer Link"
                        rel="noreferrer"
                    >
                        {t('user_registration.notes_on_priv_agreement')}
                    </a>
                )
            },
        ];

        if (locale === 'de') {
            return firstElements.concat(addressElements).concat(countrySelect).concat(newsletterElement).concat(otherElements);
        } else {
            return firstElements.concat(addressElements).concat(countrySelect).concat(otherElements);
        }
    }

    return (
        <Form
            scope='user_registration'
            onSubmit={function(params){submitRegister(`${pathBase}/user_registrations`, params)}}
            submitText='user_registration.register'
            elements={formElements()}
        />
    );
}
