import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';

export default function ProjectShortnamesCell({ row }) {
    const { t } = useI18n();
    const projects = useSelector(getProjects);
    const user = row.original;
    const userProjects = Object.values(user.user_projects);

    const projectDisplay = (userProject) => {
        if (userProject) {
            const workflowState = t(
                `workflow_states.user_projects.${userProject.workflow_state}`
            );
            const hasAMRole = Object.values(user.user_roles).find(
                (role) =>
                    role.name === 'Archivmanagement' &&
                    role.project_id === userProject.project_id
            );
            const project = projects[userProject.project_id];

            if (project.shortname === 'ohd') {
                return null;
            }

            return (
                <li key={userProject.id} className="DetailList-item">
                    {project.shortname +
                        ' - ' +
                        workflowState +
                        (hasAMRole ? ' - AM' : '')}
                </li>
            );
        }
    };

    return (
        <ul className="DetailList">
            {userProjects.map((urp) => projectDisplay(urp))}
        </ul>
    );
}

ProjectShortnamesCell.propTypes = {
    row: PropTypes.object.isRequired,
};
