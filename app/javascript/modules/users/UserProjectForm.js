import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function UserProjectForm({
    UserProject,
    locale,
    projectId,
    project,
    submitData,
    onSubmit,
}) {
    return (
        <Form
            scope='user_project'
            onSubmit={(params) => {
                submitData({ locale, projectId, project }, params);
                if (typeof onSubmit === 'function') {
                    onSubmit();
                }
            }}
            data={UserProject}
            values={{ default_locale: locale }}
            submitText='submit'
            elements={[
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: UserProject && Object.values(UserProject.workflow_states),
                    value: UserProject?.workflow_state,
                    optionsScope: 'workflow_states',
                    withEmpty: true
                },
                {
                    elementType: 'textarea',
                    attribute: 'admin_comments',
                    value: UserProject?.admin_comments,
                },
            ]}
        />
    );
}

UserProjectForm.propTypes = {
    UserProject: PropTypes.object,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
};
