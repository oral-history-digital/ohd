import { getCountryKeys } from 'modules/archive';
import { EMAIL_REGEX } from 'modules/constants';
import { Form } from 'modules/forms';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function UserDetailsForm({
    user,
    locale,
    project,
    projectId,
    onSubmit,
    submitData,
    onCancel,
}) {
    const countryKeys = useSelector(getCountryKeys);

    return (
        <Form
            data={user}
            scope="user"
            onSubmit={(params) => {
                submitData({ locale, project, projectId }, params);
                onSubmit();
            }}
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
                    elementType: 'select',
                    attribute: 'country',
                    optionsScope: 'countries',
                    values: countryKeys && countryKeys[locale],
                    withEmpty: true,
                    validate: function (v) {
                        return v && v.length > 1;
                    },
                },
                {
                    attribute: 'street',
                    type: 'text',
                    validate: function (v) {
                        return v && v.length > 1;
                    },
                },
                {
                    attribute: 'zipcode',
                    type: 'text',
                },
                {
                    attribute: 'city',
                    type: 'text',
                    validate: function (v) {
                        return v && v.length > 1;
                    },
                },
                {
                    elementType: 'input',
                    attribute: 'receive_newsletter',
                    type: 'checkbox',
                    help: 'user.notes_on_receive_newsletter',
                },
                {
                    elementType: 'input',
                    attribute: 'otp_required_for_login',
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
};
