import { useState } from 'react';

import { EMAIL_REGEX } from 'modules/constants';
import { InputContainer } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export default function OrderNewPasswordForm({ user, submitOrderNewPassword }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const location = useLocation();
    const from = location.state?.from;

    const [emailCheckResponse, setEmailCheckResponse] = useState({
        reset_password_error: false,
        msg: null,
    });

    const [email, setEmail] = useState(
        user && EMAIL_REGEX.test(user.email) ? user.email : null
    );
    const [error, setError] = useState(!(user && EMAIL_REGEX.test(user.email)));

    const handleChange = (name, value) => {
        if (EMAIL_REGEX.test(value)) {
            fetch(`${pathBase}/users/check_email?email=${value}`)
                .then((res) => res.json())
                .then((json) => setEmailCheckResponse(json));
        }
        setEmail(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!error && !emailCheckResponse.reset_password_error) {
            submitOrderNewPassword(`${pathBase}/users/password`, {
                user: { email, from },
            });
        }
    };

    const handleErrors = (name, bool) => {
        setError(bool);
    };

    return (
        <form className="default" onSubmit={handleSubmit}>
            <InputContainer
                scope="user"
                attribute="email"
                value={user && EMAIL_REGEX.test(user.email) ? user.email : ''}
                type="text"
                showErrors={error || emailCheckResponse.reset_password_error}
                help={
                    emailCheckResponse.reset_password_error && (
                        <p className="notifications">
                            {emailCheckResponse.msg}
                        </p>
                    )
                }
                validate={function (v, t) {
                    return EMAIL_REGEX.test(v) && !t;
                }}
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

OrderNewPasswordForm.propTypes = {
    user: PropTypes.object,
    submitOrderNewPassword: PropTypes.func.isRequired,
};
