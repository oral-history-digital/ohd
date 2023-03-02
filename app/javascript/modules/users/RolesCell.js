import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { UserRolesContainer } from 'modules/roles';

export default function RolesCell({
    row,
}) {
    const { t } = useI18n();
    const project = useSelector(getCurrentProject);
    //const projects = useSelector(getProjects);
    const userRegistration = row.original;
    const roles = Object.values(userRegistration.user_roles).filter(u => u.project_id === project.id) || [];

    //const userRegistrationProjects = Object.values(userRegistration.user_registration_projects);

    //const projectDisplay = userRegistrationProject => {
        //if (userRegistrationProject) {
            //const workflowState = t(`user_registration_projects.workflow_states.${userRegistrationProject.workflow_state}`);
            //const hasAMRole = Object.values(userRegistration.user_roles).find(role => 
                //role.name === 'Archivmanagement' && role.project_id === userRegistrationProject.project_id);

            //return (
                //<li
                    //key={userRegistrationProject.id}
                    //className="DetailList-item"
                //>
                    //{ projects[userRegistrationProject.project_id].shortname + ' - ' + workflowState + (hasAMRole ? ' - AM' : '') }
                //</li>
            //)
        //}
    //}

    return (
        <UserRolesContainer
            userRoles={roles}
            userAccountId={userRegistration.user_account_id}
            hideEdit={false}
        />
    );
}

RolesCell.propTypes = {
    getValue: PropTypes.object.isRequired,
};
