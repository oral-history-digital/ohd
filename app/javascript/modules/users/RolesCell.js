import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentProject } from 'modules/data';
import { UserRolesContainer } from 'modules/roles';

export default function RolesCell({
    row,
}) {
    const project = useSelector(getCurrentProject);
    const userRegistration = row.original;
    const roles = Object.values(userRegistration.user_roles).filter(u => u.project_id === project.id) || [];

    return (
        <UserRolesContainer
            userRoles={roles}
            userAccountId={userRegistration.user_account_id}
            userRegistrationId={userRegistration.id}
            hideEdit={false}
        />
    );
}

RolesCell.propTypes = {
    getValue: PropTypes.object.isRequired,
};
