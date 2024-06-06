import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { submitDataWithFetch } from 'modules/api';
import { useMutateData, useMutateDatum } from 'modules/data';
import { usePathBase } from 'modules/routes';

export default function UserRoleForm ({
    dataPath,
    userId,
    projectId,
    project,
    locale,
    roles,
    rolesStatus,
    fetchData,
    onSubmit,
}) {

    const mutateData = useMutateData('users', dataPath);
    const mutateDatum = useMutateDatum();
    const pathBase = usePathBase();

    useEffect(() => {
        if (
            !rolesStatus[`for_projects_${project?.id}`] ||
            rolesStatus[`for_projects_${project?.id}`].split('-')[0] === 'reload'
        ) {
            fetchData( { locale, projectId, project }, 'roles', null, null, `for_projects=${project?.id}`);
        }
    });

    return (
        <div>
            <Form
                scope='user_role'
                onSubmit={ async (params) => {
                    mutateData( async users => {
                        const result = await submitDataWithFetch(pathBase, params);
                        const updatedDatum = result.data;
                        const userIndex = users.data.findIndex(u => u.id === userId);

                        if (updatedDatum.id) {
                            mutateDatum(userId, 'users');
                        }

                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }

                        const updatedUsers = [...users.data.slice(0, userIndex), updatedDatum, ...users.data.slice(userIndex + 1)];
                        return { ...users, data: updatedUsers };
                    });
                }}
                values={{
                    user_id: userId,
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
    roles: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
