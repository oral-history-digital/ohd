import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function UserRegistrationProjectForm({
    userRegistrationProject,
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
            data={userRegistrationProject}
            values={{ default_locale: locale }}
            submitText='submit'
            elements={[
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: userRegistrationProject && Object.values(userRegistrationProject.workflow_states),
                    value: userRegistrationProject?.workflow_state,
                    optionsScope: 'workflow_states',
                    withEmpty: true
                },
                {
                    elementType: 'textarea',
                    attribute: 'admin_comments',
                    value: userRegistrationProject?.admin_comments,
                },
            ]}
        />
    );
}

UserRegistrationProjectForm.propTypes = {
    userRegistrationProject: PropTypes.object,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
};