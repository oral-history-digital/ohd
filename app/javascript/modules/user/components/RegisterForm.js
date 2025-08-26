import { useState } from 'react';
import request from 'superagent';

import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { NON_ZIP_COUNTRIES } from '../constants';
import { OHD_DOMAINS } from 'modules/constants';

export default function RegisterForm({
    project,
    ohdProject,
    countryKeys,
    submitRegister,
    onSubmit,
    onCancel,
    registrationStatus,
}) {

    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const conditionsLink = `${OHD_DOMAINS[railsMode]}/${locale}/conditions`;
    const privacyLink = `${OHD_DOMAINS[railsMode]}/${locale}/privacy_protection`;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const [emailCheckResponse, setEmailCheckResponse] = useState({registration_error: false, msg: null});

    const handleEmailChange = async(name, value) => {
        if (emailRegex.test(value)) {
            fetch(`${pathBase}/users/check_email?email=${value}`)
                .then(res => res.json())
                .then(json => setEmailCheckResponse(json));
        }
    };

    const [password, setPassword] = useState(null);
    const [hideZip, setHideZip] = useState(true);

    const handlePasswordChange = (name, value, data) => {
        setPassword(value);
    };

    const formElements = () => {
        const nameElements = [
            {
                elementType: 'select',
                attribute: 'appellation',
                values: ['not_specified', 'dr', 'prof'],
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

        const countrySelect = [
            {
                elementType: 'select',
                attribute: 'country',
                optionsScope: 'countries',
                values: countryKeys && countryKeys[locale],
                withEmpty: true,
                validate: function(v){return v && v.length > 1},
                handlechangecallback: (name, value) => {
                    setHideZip(NON_ZIP_COUNTRIES.indexOf(value) > -1);
                },
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
                //validate: function(v){return v && v.length > 1},
                hidden: hideZip,
            },
            {
                elementType: 'input',
                attribute: 'city',
                type: 'text',
                validate: function(v){return v && v.length > 1}
            }
        ];

        const emailPasswordElements = [
            {
                elementType: 'input',
                attribute: 'email',
                type: 'email',
                handlechangecallback: handleEmailChange,
                validate: function(v){return emailRegex.test(v)},
                help: emailCheckResponse.registration_error && (
                    <p className='notifications'>
                        {emailCheckResponse.msg}
                    </p>
                ),
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
                help: t('user.notes_on_tos_agreement_ohd', {
                    tos_link: <a
                        className="Link"
                        href={conditionsLink}
                        target="_blank"
                        title="Externer Link"
                        rel="noreferrer"
                    >
                        {t('user.tos_agreement')}
                    </a>
                })
            },
            {
                elementType: 'input',
                attribute: 'priv_agreement' ,
                labelKey: 'user.priv_agreement',
                type: 'checkbox',
                validate: function(v){return v && v !== '0'},
                help: t('user.notes_on_priv_agreement', {
                    priv_link: <a
                        className="Link"
                        href={privacyLink}
                        target="_blank"
                        title="Externer Link"
                        rel="noreferrer"
                    >
                        {t('user.priv_agreement')}
                    </a>
                })
            },
        ];

        return nameElements.concat(countrySelect).concat(addressElements).concat(emailPasswordElements).concat(tosPrivacyElements);
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
                            { project.is_ohd ? t('user.registration_text_one_ohd') : t('user.registration_text_one')}
                            <a href={conditionsLink} target="_blank" title="" rel="noreferrer">
                                {t('user.tos_agreement')}
                            </a>
                            {t('user.registration_text_two')}
                            <a href={privacyLink} target="_blank" title="" rel="noreferrer">
                                {t('user.priv_agreement_alias')}
                            </a>
                            {t('user.registration_text_three')}
                            { project.is_ohd ? t('user.registration_text_four') : ''}
                        </p>
                    </div>
                )
            }
            <Form
                scope='user'
                onSubmit={(params) => {
                    if (!emailCheckResponse.registration_error) {
                        submitRegister(`${pathBase}/users`, params); onSubmit();
                    } else {
                        return null; 
                    }
                }}
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
