import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function UserDetailsForm({
    user,
    locale,
    project,
    projectId,
    onSubmit,
    submitData,
    onCancel,
}) {
    return (
        <Form
            data={user}
            scope="user"
            onSubmit={params => {submitData({ locale, project, projectId }, params); onSubmit();}}
            onCancel={onCancel}
            submitText='submit'
            elements={[
                {
                    attribute: 'first_name',
                    validate: function(v){return v.length > 1}
                },
                {
                    attribute: 'last_name',
                    validate: function(v){return v.length > 1}
                },
                {
                    attribute: 'email',
                    elementType: 'input',
                    type: 'email',
                    validate: function(v){return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)}
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
