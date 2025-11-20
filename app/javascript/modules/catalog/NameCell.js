import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { usePathBase, LinkOrA } from 'modules/routes';
import { getProjects } from 'modules/data';

export default function NameCell({ row }) {
    const pathBase = usePathBase();
    const projects = useSelector(getProjects);

    let path;
    switch (row.original.type) {
        case 'institution':
            path = `${pathBase}/catalog/institutions/${row.original.id}`;
            break;
        case 'project':
            path = `${pathBase}/catalog/archives/${row.original.id}`;
            break;
        case 'collection':
            path = `${pathBase}/catalog/collections/${row.original.id}`;
            break;
        case 'interview':
            path = `interviews/${row.original.shortname}`;

            return (
                <div style={{ paddingLeft: `${row.depth * 2}rem` }}>
                    <LinkOrA
                        project={projects[row.original.project_id]}
                        to={path}
                    >
                        {row.original.name}
                    </LinkOrA>
                </div>
            );
        default:
            path = '';
    }

    return (
        <div style={{ paddingLeft: `${row.depth * 2}rem` }}>
            <Link to={path}>{row.original.name}</Link>
        </div>
    );
}

NameCell.propTypes = {
    row: PropTypes.object.isRequired,
};
