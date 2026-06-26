import PropTypes from 'prop-types';

export default function ArchiveManagementInCell({ row }) {
    const user = row.original;
    const entries = Object.values(user.user_roles)
        .map((role) => {
            if (!role.archive_management) {
                return null;
            }

            if (!role.project_shortname) {
                console.warn(
                    '[ArchiveManagementInCell] Missing project for user role',
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
                label: role.project_shortname,
                title: `${role.project_name} (ID: ${role.project_id})`,
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
