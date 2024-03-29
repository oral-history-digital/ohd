import { useState } from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';

import { InputContainer } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function OrderNewPasswordForm ({
    account,
    submitOrderNewPassword,
}) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const [emailCheckResponse, setEmailCheckResponse] = useState({email_taken: false, msg: null});

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const [email, setEmail] =  useState(account && emailRegex.test(account.email) ? account.email : null);
    const [error, setError] =  useState(!(account && emailRegex.test(account.email)));

    const handleChange = (name, value) => {
        if (emailRegex.test(value)) {
            fetch(`${pathBase}/passwords/check_email?email=${value}`)
                .then(res => res.json())
                .then(json => setEmailCheckResponse(json));
        }
        setEmail(value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!error && !emailCheckResponse.error) {
            submitOrderNewPassword(`${pathBase}/user_accounts/password`, {user_account: {email: email}});
        }
    }

    const handleErrors = (name, bool) => {
        setError(bool);
    }

    return (
        <form className='default' onSubmit={handleSubmit}>
            <InputContainer
                scope='user_registration'
                attribute='email'
                value={account && emailRegex.test(account.email) ? account.email : ''}
                type='text'
                showErrors={error || emailCheckResponse.error}
                help={emailCheckResponse.error && (
                    <p className='notifications'>
                        {emailCheckResponse.msg}
                    </p>
                )}
                validate={function(v, t){return (emailRegex.test(v) && !t)}}
                handleChange={handleChange}
                handleErrors={handleErrors}
            />
            <input
                type="submit"
                className="Button Button--primaryAction"
                value={t('devise.registrations.activate_submit')}
            />
        </form>
    );
}
