import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';

export default function ArchiveManagementInCell({ row }) {
    const { t } = useI18n();
    const projects = useSelector(getProjects);
    const user = row.original;

    return (
        <ul className="DetailList">
            {Object.values(user.user_roles).map((role) => {
                if (role.name === 'Archivmanagement') {
                    const project = projects[role.project_id];
                    return (
                        <li key={project.id} className="DetailList-item">
                            {project.shortname}
                        </li>
                    );
                }
            })}
        </ul>
    );
}

ArchiveManagementInCell.propTypes = {
    row: PropTypes.object.isRequired,
};
