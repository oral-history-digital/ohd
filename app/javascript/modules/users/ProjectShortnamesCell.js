import { useSelector } from 'react-redux';
import { getProjects } from 'modules/data';

import PropTypes from 'prop-types';

export default function ProjectShortnamesCell({
    getValue
}) {
    const projects = useSelector(getProjects);
    const userRegistrationProjects = Object.values(getValue('user_registration_projects'));

    return (
        <ul  className="DetailList">
            {userRegistrationProjects.map(urp => (
                <li
                    key={urp.id}
                    className="DetailList-item"
                >
                    {projects[urp.project_id].shortname}
                </li>
            ))}
        </ul>
    );
}

ProjectShortnamesCell.propTypes = {
    getValue: PropTypes.func.isRequired,
};
