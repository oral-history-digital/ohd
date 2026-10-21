import { useEffect } from 'react';

import { submitDataWithFetch } from 'modules/api';
import {
    fetchData,
    getRolesForCurrentProject,
    getRolesStatus,
    useMutateData,
    useMutateDatum,
} from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase, useProjectIdentity } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Assigns a role using choices loaded for the current project route.
 * @param {Object} props - User ID, user-list cache path, and successful-save callback.
 * @returns {React.ReactElement} Role form or pending project identity.
 */
export default function UserRoleForm({ dataPath, userId, onSubmit }) {
    const mutateData = useMutateData('users', dataPath);
    const mutateDatum = useMutateDatum();
    const pathBase = usePathBase();

    const { projectDbId } = useProjectIdentity();
    const dispatch = useDispatch();
    const roles = useSelector(getRolesForCurrentProject);
    const rolesStatus = useSelector(getRolesStatus);
    const status = rolesStatus?.[`for_projects_${projectDbId}`];

    useEffect(() => {
        if (projectDbId && (!status || status.split('-')[0] === 'reload')) {
            dispatch(
                fetchData(
                    { pathBase },
                    'roles',
                    null,
                    null,
                    `for_projects=${projectDbId}`
                )
            );
        }
    }, [dispatch, pathBase, projectDbId, status]);

    if (!projectDbId) return <Spinner />;

    return (
        <div>
            <Form
                scope="user_role"
                onSubmit={async (params) => {
                    mutateData(async (users) => {
                        const result = await submitDataWithFetch(
                            pathBase,
                            params
                        );
                        const updatedDatum = result.data;
                        const userIndex = users.data.findIndex(
                            (u) => u.id === userId
                        );

                        if (updatedDatum.id) {
                            mutateDatum(userId, 'users');
                        }

                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }

                        const updatedUsers = [
                            ...users.data.slice(0, userIndex),
                            updatedDatum,
                            ...users.data.slice(userIndex + 1),
                        ];
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
                        validate: function (v) {
                            return v !== '';
                        },
                    },
                ]}
                helpTextCode="user_role_form"
            />
        </div>
    );
}

UserRoleForm.propTypes = {
    userId: PropTypes.number.isRequired,
    dataPath: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
};
