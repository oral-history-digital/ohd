import { getProjects } from 'modules/data';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function ArchiveManagementInCell({ row }) {
    const projects = useSelector(getProjects);
    const user = row.original;

    return (
        <ul className="DetailList">
            {Object.values(user.user_roles).map((role) => {
                if (role.name === 'Archivmanagement') {
                    const project = projects?.[role.project_id];
                    if (!project?.shortname) {
                        console.warn(
                            '[ArchiveManagementInCell] Missing project for user role',
                            {
                                roleId: role.id,
                                projectId: role.project_id,
                                userId: user.id,
                            }
                        );

                        return (
                            <li key={role.id} className="DetailList-item">
                                {`Unknown project (ID: ${role.project_id})`}
                            </li>
                        );
                    }

                    return (
                        <li key={role.id} className="DetailList-item">
                            {project.shortname}
                        </li>
                    );
                }

                return null;
            })}
        </ul>
    );
}

ArchiveManagementInCell.propTypes = {
    row: PropTypes.object.isRequired,
};
