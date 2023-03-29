import { useState } from 'react';
import request from 'superagent';

import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import findExternalLink from '../findExternalLink';

export default function RegisterForm({
    ohd,
    countryKeys,
    submitRegister,
    onSubmit,
    onCancel,
    registrationStatus,
}) {

    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const conditionsLink = findExternalLink(ohd, 'conditions');
    const privacyLink = findExternalLink(ohd, 'privacy_protection');

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const [emailCheckResponse, setEmailCheckResponse] = useState({email_taken: false, msg: null});

    const handleEmailChange = async(name, value) => {
        if (emailRegex.test(value)) {
            fetch(`${pathBase}/users/check_email?email=${value}`)
                .then(res => res.json())
                .then(json => setEmailCheckResponse(json));
        }
    };

    const [password, setPassword] = useState(null);

    const handlePasswordChange = (name, value, data) => {
        setPassword(value);
    };

    const formElements = () => {
        const nameElements = [
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
        ];

        const addressElements = [
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

        const countrySelect = [
            {
                elementType: 'select',
                attribute: 'country',
                optionsScope: 'countries',
                values: countryKeys && countryKeys[locale],
                withEmpty: true,
                validate: function(v){return v && v.length > 1}
            },
        ];

        const emailPasswordElements = [
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
                otherError: emailCheckResponse.email_taken,
                validate: function(v, t){return (emailRegex.test(v) && !t)},
            },
            {
                elementType: 'input',
                attribute: 'password',
                type: 'password',
                validate: function(v){return v && v.length > 6},
                handlechangecallback: handlePasswordChange,
            },
            {
                elementType: 'input',
                attribute: 'password_confirmation',
                type: 'password',
                validate: function(v){return v && v.length > 6 && v === password},
            },
        ];

        const newsletterElement = [
            {
                elementType: 'input',
                attribute: 'receive_newsletter',
                type: 'checkbox',
                help: 'user.notes_on_receive_newsletter'
            },
        ];

        const tosPrivacyElements = [
            {
                elementType: 'input',
                attribute: 'tos_agreement',
                labelKey: 'user.tos_agreement',
                type: 'checkbox',
                validate: function(v){return v && v !== '0'},
                help: (
                    <a
                        className="Link"
                        href={conditionsLink[locale]}
                        target="_blank"
                        title="Externer Link"
                        rel="noreferrer">
                        {t('user.notes_on_tos_agreement')}
                    </a>
                )
            },
            {
                elementType: 'input',
                attribute: 'priv_agreement' ,
                labelKey: 'user.priv_agreement',
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
                        {t('user.notes_on_priv_agreement')}
                    </a>
                )
            },
        ];

        //if (locale === 'de') {
            //return nameElements.concat(addressElements).concat(countrySelect).concat(newsletterElement).concat(tosPrivacyElements);
        //} else {
            return nameElements.concat(addressElements).concat(countrySelect).concat(emailPasswordElements).concat(tosPrivacyElements);
        //}
    }

    return (
        <>
            {
                registrationStatus ? (
                    <p className='error'>
                        className='status'
                        dangerouslySetInnerHTML={{__html: registrationStatus}}
                    >
                    </p>
                ) : (
                    <div>
                        <p>
                            {t('user.registration_text_one')}
                            <a href={conditionsLink[locale]} target="_blank" title="" rel="noreferrer">
                                {t('user.tos_agreement')}
                            </a>
                            {t('user.registration_text_two')}
                            <a href={privacyLink[locale]} target="_blank" title="" rel="noreferrer">
                                {t('user.priv_agreement_alias')}
                            </a>
                            {t('user.registration_text_three')}
                        </p>
                    </div>
                )
            }
            <Form
                scope='user'
                onSubmit={function(params){submitRegister(`${pathBase}/users`, params); onSubmit();}}
                submitText='user.register'
                elements={formElements()}
                values={{
                    default_locale: locale,
                    pre_register_location: location.href,
                }}
                onCancel={onCancel}
            />
        </>
    );
}
