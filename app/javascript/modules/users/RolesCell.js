import { UserRoles } from 'modules/roles';
import { useProjectIdentity } from 'modules/routes';
import PropTypes from 'prop-types';

/**
 * Shows the user's roles for the current project.
 * @param {Object} props - Table row and cell accessors.
 * @returns {React.ReactElement|null} Project-scoped assignments, or nothing until identity is available.
 */
export default function RolesCell({ row, getValue }) {
    const dataPath = getValue();
    const { projectDbId } = useProjectIdentity();
    const user = row.original;
    const roles = Object.values(user.user_roles).filter(
        (role) => role.project_id === projectDbId
    );

    if (!projectDbId) return null;

    return (
        <UserRoles
            key={`user-roles-${user.id}`}
            userRoles={roles}
            userId={user.id}
            hideEdit={false}
            dataPath={dataPath}
        />
    );
}

RolesCell.propTypes = {
    row: PropTypes.shape({ original: PropTypes.object.isRequired }).isRequired,
    getValue: PropTypes.func.isRequired,
};
