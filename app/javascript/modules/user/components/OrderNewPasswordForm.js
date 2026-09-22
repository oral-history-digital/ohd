import { useRef, useState } from 'react';

import { EMAIL_REGEX } from 'modules/constants';
import { InputField } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export default function OrderNewPasswordForm({ user, submitOrderNewPassword }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const location = useLocation();
    const from = location.state?.from;

    // Typing can start overlapping checks; only the newest response is relevant.
    const emailCheckId = useRef(0);
    const [emailCheckResponse, setEmailCheckResponse] = useState({
        reset_password_error: false,
        msg: null,
    });

    const [email, setEmail] = useState(
        user && EMAIL_REGEX.test(user.email) ? user.email : null
    );
    const [error, setError] = useState(!(user && EMAIL_REGEX.test(user.email)));

    const handleChange = (name, value) => {
        const checkId = ++emailCheckId.current;
        // Keep submission disabled until the current email check has completed.
        setEmailCheckResponse(null);
        if (EMAIL_REGEX.test(value)) {
            fetch(`${pathBase}/users/check_email?email=${value}`)
                .then((res) => res.json())
                .then((json) => {
                    if (checkId === emailCheckId.current) {
                        setEmailCheckResponse(json);
                    }
                });
        }
        setEmail(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            !error &&
            emailCheckResponse &&
            !emailCheckResponse.reset_password_error
        ) {
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
            <InputField
                scope="user"
                attribute="email"
                value={user && EMAIL_REGEX.test(user.email) ? user.email : ''}
                type="text"
                showErrors={
                    error || emailCheckResponse?.reset_password_error || false
                }
                help={
                    emailCheckResponse?.reset_password_error && (
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
                disabled={
                    error ||
                    !emailCheckResponse ||
                    emailCheckResponse.reset_password_error
                }
            />
        </form>
    );
}

OrderNewPasswordForm.propTypes = {
    user: PropTypes.object,
    submitOrderNewPassword: PropTypes.func.isRequired,
};
