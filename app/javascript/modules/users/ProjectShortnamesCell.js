import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';

export default function ProjectShortnamesCell({
    row,
}) {
    const { t } = useI18n();
    const projects = useSelector(getProjects);
    const userRegistration = row.original;
    const userRegistrationProjects = Object.values(userRegistration.user_registration_projects);

    const projectDisplay = userRegistrationProject => {
        if (userRegistrationProject) {
            const workflowState = t(`user_registration_projects.workflow_states.${userRegistrationProject.workflow_state}`);
            const hasAMRole = Object.values(userRegistration.user_roles).find(role => 
                role.name === 'Archivmanagement' && role.project_id === userRegistrationProject.project_id);

            return (
                <li
                    key={userRegistrationProject.id}
                    className="DetailList-item"
                >
                    { projects[userRegistrationProject.project_id].shortname + ' - ' + workflowState + (hasAMRole ? ' - AM' : '') }
                </li>
            )
        }
    }

    return (
        <ul  className="DetailList">
            {userRegistrationProjects.map(urp => (
                projectDisplay(urp)
            ))}
        </ul>
    );
}

ProjectShortnamesCell.propTypes = {
    getValue: PropTypes.func.isRequired,
};
