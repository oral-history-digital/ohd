import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';

export default function ProjectShortnamesCell({
    row,
}) {
    const { t } = useI18n();
    const projects = useSelector(getProjects);
    const user = row.original;
    const UserProjects = Object.values(user.user_projects);

    const projectDisplay = UserProject => {
        if (UserProject) {
            const workflowState = t(`user_projects.workflow_states.${UserProject.workflow_state}`);
            const hasAMRole = Object.values(user.user_roles).find(role => 
                role.name === 'Archivmanagement' && role.project_id === UserProject.project_id);
            const project = projects[UserProject.project_id];

            if (project.shortname === 'ohd') {
                return null;
            }

            return (
                <li
                    key={UserProject.id}
                    className="DetailList-item"
                >
                    { project.shortname + ' - ' + workflowState + (hasAMRole ? ' - AM' : '') }
                </li>
            )
        }
    }

    return (
        <ul className="DetailList">
            {UserProjects.map(urp => (
                projectDisplay(urp)
            ))}
        </ul>
    );
}

ProjectShortnamesCell.propTypes = {
    row: PropTypes.object.isRequired,
};
