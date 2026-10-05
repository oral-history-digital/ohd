import { EMAIL_REGEX } from 'modules/constants';
import { Form } from 'modules/forms';
import PropTypes from 'prop-types';

export default function UserDetailsForm({
    user,
    locale,
    project,
    projectId,
    onSubmit,
    submitData,
    onCancel,
    onEmailChange,
}) {
    function handleSubmit(params) {
        submitData({ locale, project, projectId }, params, {}, (response) => {
            if (
                response.data?.unconfirmed_email &&
                response.data.unconfirmed_email !== user.unconfirmed_email &&
                typeof onEmailChange === 'function'
            ) {
                onEmailChange();
            }
            onSubmit();
        });
    }

    return (
        <Form
            data={user}
            scope="user"
            onSubmit={handleSubmit}
            onCancel={onCancel}
            submitText="submit"
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
    locale: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onEmailChange: PropTypes.func,
};
