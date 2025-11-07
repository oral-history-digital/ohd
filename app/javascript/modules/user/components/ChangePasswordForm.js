import { useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

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

    const params = new URLSearchParams(document.location.search);
    const resetPasswordToken = params.get('reset_password_token');

    // Does what? Redirect after login?
    const prevAccount = usePrevious(user);
    if (!prevAccount?.email && user.email) {
        const to = projectId ? `${pathBase}/searches/archive` : `/${locale}`;
        location = to;
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
            let params = values;

            const url = `${pathBase}/users/password`;
            params.reset_password_token = resetToken;

            submitChangePassword(url, 'put', {user: params});
        }
    }

    return (
        <div>
            <h1>
                {t('devise.passwords.change')}
            </h1>

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
                    validate={v => v?.length > 6}
                    handleChange={handleChange}
                    handleErrors={handleErrors}
                />
                <InputContainer
                    label={t('devise.passwords.password_confirmation')}
                    attribute='password_confirmation'
                    type='password'
                    showErrors={showErrors}
                    validate={v => v?.length > 6 && v === values.password}
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
