import PropTypes from 'prop-types';

export default function ArchiveManagementInCell({ row }) {
    const user = row.original;
    const userProjectsByProjectId = Object.values(
        user.user_projects || {}
    ).reduce((memo, userProject) => {
        memo[userProject.project_id] = userProject;
        return memo;
    }, {});
    const entries = Object.values(user.user_roles)
        .map((role) => {
            if (role.name !== 'Archivmanagement') {
                return null;
            }

            const userProject = userProjectsByProjectId[role.project_id];

            if (!userProject?.shortname) {
                console.warn(
                    '[ArchiveManagementInCell] Missing user project for user role',
                    {
                        roleId: role.id,
                        projectId: role.project_id,
                        userId: user.id,
                    }
                );

                return {
                    id: role.id,
                    label: `Unknown project (ID: ${role.project_id})`,
                };
            }

            return {
                id: role.id,
                label: userProject.shortname,
                title: `${userProject.name} (ID: ${userProject.project_id})`,
            };
        })
        .filter(Boolean);

    return (
        <span>
            {entries.map((entry, index) => (
                <span key={entry.id} title={entry.title}>
                    {index > 0 && ', '}
                    {entry.label}
                </span>
            ))}
        </span>
    );
}

ArchiveManagementInCell.propTypes = {
    row: PropTypes.object.isRequired,
};
