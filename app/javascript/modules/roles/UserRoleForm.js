import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default function UserRoleForm ({
    userAccountId,
    projectId,
    projects,
    project,
    locale,
    rolesStatus,
    fetchData,
    submitData,
    onSubmit,
}) {

    useEffect(() => {
        if (
            !rolesStatus[`for_projects_${project?.id}`] ||
            rolesStatus[`for_projects_${project?.id}`].split('-')[0] === 'reload'
        ) {
            fetchData( { locale, projectId, projects }, 'roles', null, null, `for_projects=${project?.id}`);
        }
    });

    return (
        <div>
            <Form
                scope='user_role'
                onSubmit={(params) => { submitData( params); onSubmit(); }}
                values={{
                    user_account_id: userAccountId,
                }}
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'role_id',
                        values: roles,
                        withEmpty: true,
                        validate: function(v){return v !== ''}
                    },
                ]}
                helpTextCode="user_role_form"
            />
        </div>
    );
}

UserRoleForm.propTypes = {
    rolesStatus: PropTypes.object.isRequired,
    userAccountId: PropTypes.number.isRequired,
    roles: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
