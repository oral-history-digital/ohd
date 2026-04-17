/* global railsMode */
import { useRef, useState } from 'react';

import { getCountryKeys } from 'modules/archive';
import { EMAIL_REGEX, OHD_DOMAINS, PASSWORD_REGEX } from 'modules/constants';
import { getCurrentProject } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { sanitizeInternalReturnPath } from 'modules/query-string';
import { usePathBase } from 'modules/routes';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { clearRegistrationStatus, submitRegister } from '../actions';
import { NON_ZIP_COUNTRIES } from '../constants';
import { getRegistrationStatus } from '../selectors';

export default function RegisterForm({
    onSubmit = () => null,
    onCancel = () => null,
    showCancelButton = false,
}) {
    const project = useSelector(getCurrentProject);
    const countryKeys = useSelector(getCountryKeys);
    const registrationStatus = useSelector(getRegistrationStatus);
    const dispatch = useDispatch();

    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const storedReturnPath = sessionStorage.getItem('registrationReturnPath');
    const sanitizedStoredReturnPath = sanitizeInternalReturnPath(
        storedReturnPath,
        null
    );
    const preRegisterLocation = sanitizedStoredReturnPath
        ? `${location.origin}${sanitizedStoredReturnPath}`
        : location.href;

    const conditionsLink = `${OHD_DOMAINS[railsMode]}/${locale}/conditions`;
    const privacyLink = `${OHD_DOMAINS[railsMode]}/${locale}/privacy_protection`;

    const [emailCheckResponse, setEmailCheckResponse] = useState({
        registration_error: false,
        msg: null,
    });
    const emailCheckRequestRef = useRef(0);

    const checkEmailAvailability = async (email) => {
        if (!EMAIL_REGEX.test(email)) {
            const fallback = { registration_error: false, msg: null };
            setEmailCheckResponse(fallback);
            return fallback;
        }

        const requestId = emailCheckRequestRef.current + 1;
        emailCheckRequestRef.current = requestId;

        try {
            const response = await fetch(
                `${pathBase}/users/check_email?email=${encodeURIComponent(email)}`
            );
            const json = await response.json();

            if (emailCheckRequestRef.current === requestId) {
                setEmailCheckResponse(json);
            }

            return json;
        } catch (error) {
            return { registration_error: false, msg: null };
        }
    };

    const handleEmailChange = async (_, value) => {
        await checkEmailAvailability(value);
    };

    const [password, setPassword] = useState('');
    const [hideZip, setHideZip] = useState(true);

    const handlePasswordChange = (_, value) => {
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
                group: 'name',
            },
            {
                elementType: 'input',
                attribute: 'first_name',
                type: 'text',
                validate: function (v) {
                    return v && v.length > 1;
                },
                group: 'name',
            },
            {
                elementType: 'input',
                attribute: 'last_name',
                type: 'text',
                validate: function (v) {
                    return v && v.length > 1;
                },
                group: 'name',
            },
        ];

        const countrySelect = [
            {
                elementType: 'select',
                attribute: 'country',
                optionsScope: 'countries',
                values: countryKeys && countryKeys[locale],
                withEmpty: true,
                validate: function (v) {
                    return v && v.length > 1;
                },
                handlechangecallback: (name, value) => {
                    setHideZip(NON_ZIP_COUNTRIES.indexOf(value) > -1);
                },
                group: 'address',
            },
        ];

        const addressElements = [
            {
                elementType: 'input',
                attribute: 'street',
                type: 'text',
                validate: function (v) {
                    return v && v.length > 1;
                },
                group: 'address',
            },
            {
                elementType: 'input',
                attribute: 'zipcode',
                type: 'text',
                //validate: function(v){return v && v.length > 1},
                hidden: hideZip,
                group: 'address',
            },
            {
                elementType: 'input',
                attribute: 'city',
                type: 'text',
                validate: function (v) {
                    return v && v.length > 1;
                },
                group: 'address',
            },
        ];

        const emailPasswordElements = [
            {
                elementType: 'input',
                attribute: 'email',
                type: 'email',
                handlechangecallback: handleEmailChange,
                validate: function (v) {
                    return EMAIL_REGEX.test(v);
                },
                help: emailCheckResponse.registration_error && (
                    <p className="notifications">{emailCheckResponse.msg}</p>
                ),
                group: 'email',
            },
            {
                elementType: 'input',
                attribute: 'password',
                type: 'password',
                validate: function (v) {
                    return PASSWORD_REGEX.test(v);
                },
                handlechangecallback: handlePasswordChange,
                group: 'password',
            },
            {
                elementType: 'input',
                attribute: 'password_confirmation',
                type: 'password',
                validate: function (v) {
                    return PASSWORD_REGEX.test(v) && v === password;
                },
                group: 'password',
            },
        ];

        const tosPrivacyElements = [
            {
                elementType: 'input',
                attribute: 'tos_agreement',
                labelKey: 'user.tos_agreement',
                type: 'checkbox',
                validate: function (v) {
                    return v && v !== '0';
                },
                help: t('user.notes_on_tos_agreement_ohd', {
                    tos_link: (
                        <a
                            className="Link"
                            href={conditionsLink}
                            target="_blank"
                            title="Externer Link"
                            rel="noreferrer"
                        >
                            {t('user.tos_agreement')}
                        </a>
                    ),
                }),
                group: 'agreements',
            },
            {
                elementType: 'input',
                attribute: 'priv_agreement',
                labelKey: 'user.priv_agreement',
                type: 'checkbox',
                validate: function (v) {
                    return v && v !== '0';
                },
                help: t('user.notes_on_priv_agreement', {
                    priv_link: (
                        <a
                            className="Link"
                            href={privacyLink}
                            target="_blank"
                            title="Externer Link"
                            rel="noreferrer"
                        >
                            {t('user.priv_agreement')}
                        </a>
                    ),
                }),
                group: 'agreements',
            },
        ];

        return nameElements
            .concat(countrySelect)
            .concat(addressElements)
            .concat(emailPasswordElements)
            .concat(tosPrivacyElements);
    };

    const handleRegisterSubmit = async (params) => {
        const email = params?.user?.email;
        const emailCheckResult = await checkEmailAvailability(email);

        if (!emailCheckResult.registration_error) {
            dispatch(submitRegister(`${pathBase}/users`, params, t));
            onSubmit();
        } else {
            setEmailCheckResponse(emailCheckResult);
            return null;
        }
    };

    const registrationNotification = registrationStatus
        ? {
              variant: 'error',
              title: sanitizeHtml(registrationStatus, 'PLAIN_TEXT'),
          }
        : null;

    const handleDismissRegistrationNotification = () => {
        dispatch(clearRegistrationStatus());
    };

    return (
        <>
            {registrationStatus ? (
                <div className="u-mb-small">
                    <p className="error">
                        {sanitizeHtml(registrationStatus, 'PLAIN_TEXT')}
                    </p>
                </div>
            ) : (
                <div>
                    <p>
                        {project.is_ohd
                            ? t('user.registration_text_one_ohd')
                            : t('user.registration_text_one')}
                        <a
                            href={conditionsLink}
                            target="_blank"
                            title=""
                            rel="noreferrer"
                        >
                            {t('user.tos_agreement')}
                        </a>
                        {t('user.registration_text_two')}
                        <a
                            href={privacyLink}
                            target="_blank"
                            title=""
                            rel="noreferrer"
                        >
                            {t('user.priv_agreement_alias')}
                        </a>
                        {t('user.registration_text_three')}
                        {project.is_ohd ? t('user.registration_text_four') : ''}
                    </p>
                </div>
            )}
            <Form
                scope="user"
                onSubmit={handleRegisterSubmit}
                submitText="user.register"
                elements={formElements()}
                hasValidationErrors={emailCheckResponse.registration_error}
                notification={registrationNotification}
                onDismissNotification={handleDismissRegistrationNotification}
                values={{
                    default_locale: locale,
                    pre_register_location: preRegisterLocation,
                }}
                onCancel={showCancelButton ? onCancel : undefined}
                className="Registration-form"
            />
        </>
    );
}

RegisterForm.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    showCancelButton: PropTypes.bool,
};
