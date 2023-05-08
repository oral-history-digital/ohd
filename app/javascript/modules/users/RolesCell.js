import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentProject } from 'modules/data';
import { UserRolesContainer } from 'modules/roles';

export default function RolesCell({
    row,
    getValue,
}) {
    const dataPath = getValue();
    const project = useSelector(getCurrentProject);
    const user = row.original;
    const roles = Object.values(user.user_roles).filter(u => u.project_id === project.id) || [];

    return (
        <UserRolesContainer
            userRoles={roles}
            userAccountId={user.id}
            userId={user.id}
            hideEdit={false}
            dataPath={dataPath}
        />
    );
}

RolesCell.propTypes = {
    getValue: PropTypes.object.isRequired,
};
