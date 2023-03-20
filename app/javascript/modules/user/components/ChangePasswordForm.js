import { useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { usePrevious } from 'modules/react-toolbox';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { InputContainer } from 'modules/forms';

export default function ChangePasswordForm({
    user,
    projectId,
    locale,
    submitChangePassword,
}) {
    const [showErrors, setShowErrors] = useState(false);
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({
        password: true,
        password_confirmation: true,
    });

    const { t } = useI18n();
    const pathBase = usePathBase();

    const navigate = useNavigate();
    const location = useLocation();
    const { resetPasswordToken } = useParams();

    // Does what? Redirect after login?
    const prevAccount = usePrevious(user);
    if (!prevAccount?.email && user.email) {
        const to = projectId ? `${pathBase}/searches/archive` : `/${locale}`;
        navigate(to);
    }

    function handleChange(name, value) {
        setValues(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleErrors(name, bool) {
        setErrors(prev => ({
            ...prev,
            [name]: bool,
        }));
    }

    function valid() {
        const hasErrors = Object.values(errors).includes(true);

        setShowErrors(hasErrors);
        return !hasErrors;
    }

    function handleSubmit(event) {
        event.preventDefault();
        if(valid()) {
            let resetToken = resetPasswordToken;
            if (!resetToken) {
                let query = queryString.parse(location.search);
                resetToken = query.reset_password_token;
            }
            let url, method;
            let params = values;

            if (!user.active) {
                url = `${pathBase}/users/${resetToken}/confirm`;
                method = 'post';
            } else {
                url = `${pathBase}/users/password`;
                method = 'put';
                params.reset_password_token = resetToken;
            }

            submitChangePassword(url, method, {user: params});
        }
    }

    return (
        <div>
            {user.active ? (
                <h1>
                    {t('devise.passwords.change')}
                </h1>
            ) : (
                <div>
                    <h1>
                        {t('devise.registrations.activate')}
                        &nbsp;
                        <em>{user.display_name}</em>
                    </h1>
                    <p>
                        {t('devise.registrations.activate_text')}
                    </p>
                </div>
            )}

            {user.error && (
                <p className="error">
                    {t(user.error)}
                </p>
            )}

            <form className='default' onSubmit={handleSubmit}>
                <InputContainer
                    label={t('devise.passwords.password')}
                    attribute='password'
                    type='password'
                    showErrors={showErrors}
                    validate={v => v.length > 6}
                    handleChange={handleChange}
                    handleErrors={handleErrors}
                />
                <InputContainer
                    label={t('devise.passwords.password_confirmation')}
                    attribute='password_confirmation'
                    type='password'
                    showErrors={showErrors}
                    validate={v => v.length > 6 && v === values.password}
                    handleChange={handleChange}
                    handleErrors={handleErrors}
                />

                <input type="submit" value={t('devise.registrations.activate_submit')}/>
            </form>
        </div>
    );
}

ChangePasswordForm.propTypes = {
    projectId: PropTypes.string,
    locale: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    submitChangePassword: PropTypes.func.isRequired,
};
