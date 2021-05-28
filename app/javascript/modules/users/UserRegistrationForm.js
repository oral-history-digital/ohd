import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function UserRegistrationForm({
    userRegistration,
    locale,
    projectId,
    projects,
    submitData,
    closeArchivePopup,
    onSubmit,
}) {
    return (
        <Form
            scope='user_registration_project'
            onSubmit={(params) => {
                submitData({ locale, projectId, projects }, params);
                closeArchivePopup();
                if (typeof onSubmit === 'function') {
                    onSubmit();
                }
            }}
            data={userRegistration}
            values={{ default_locale: locale }}
            submitText='submit'
            elements={[
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: userRegistration && Object.values(userRegistration.workflow_states),
                    value: userRegistration?.workflow_state,
                    optionsScope: 'workflow_states',
                    withEmpty: true
                },
                {
                    elementType: 'textarea',
                    attribute: 'admin_comments',
                    value: userRegistration?.admin_comments,
                },
            ]}
        />
    );
}

UserRegistrationForm.propTypes = {
    userRegistration: PropTypes.object,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
};
