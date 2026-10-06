import { EMAIL_REGEX } from 'modules/constants';
import { getCurrentUser } from 'modules/data';
import { Form } from 'modules/forms';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useUpdateAccount } from '../hooks/useUpdateAccount';

export default function UserDetailsForm({ onSubmit, onCancel, onEmailChange }) {
    const user = useSelector(getCurrentUser);
    const { updateAccount, isSaving, error } = useUpdateAccount();

    async function handleSubmit(params) {
        const response = await updateAccount(params);
        if (
            response.data?.unconfirmed_email &&
            response.data.unconfirmed_email !== user.unconfirmed_email &&
            typeof onEmailChange === 'function'
        ) {
            onEmailChange();
        }
        onSubmit();
        return response;
    }

    return (
        <Form
            data={user}
            scope="user"
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitText="submit"
            fetching={isSaving}
            notification={
                error
                    ? {
                          variant: 'error',
                          description: error.message,
                          isClosable: false,
                      }
                    : null
            }
            elements={[
                {
                    attribute: 'email',
                    elementType: 'input',
                    type: 'email',
                    validate: (v) => EMAIL_REGEX.test(v),
                },
                {
                    elementType: 'extra',
                    labelKey: 'user.mfa_login_info',
                },
                {
                    elementType: 'input',
                    attribute: 'otp_required_for_login',
                    type: 'checkbox',
                },
                {
                    elementType: 'input',
                    attribute: 'passkey_required_for_login',
                    type: 'checkbox',
                },
            ]}
        />
    );
}

UserDetailsForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onEmailChange: PropTypes.func,
};
