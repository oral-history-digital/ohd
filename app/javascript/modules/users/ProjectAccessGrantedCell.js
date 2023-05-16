import PropTypes from 'prop-types';

export default function ProjectAccessGrantedCell({
    row,
}) {
    const user = row.original;

    const count = Object.values(user.user_projects).reduce((n, up) => {
        return n + (up.workflow_state === 'project_access_granted');
    }, 0);

    return (<p>{count}</p>);
}

ProjectAccessGrantedCell.propTypes = {
    row: PropTypes.object.isRequired,
};
