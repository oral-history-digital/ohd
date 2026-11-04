import { useProjectIdentity } from 'modules/routes';
import { TasksContainer } from 'modules/workflow';
import PropTypes from 'prop-types';

/**
 * Shows the user's tasks for the current project.
 * @param {Object} props - Table row and cell accessors.
 * @returns {React.ReactElement|null} Project-scoped assignments, or nothing until identity is available.
 */
export default function TasksCell({ row }) {
    const { projectDbId } = useProjectIdentity();
    const user = row.original;
    const tasks = Object.values(user.tasks).filter(
        (t) => t.project_id === projectDbId
    );

    if (!projectDbId) return null;

    return (
        <TasksContainer
            data={tasks}
            initialFormValues={{ user_id: user.id }}
            hideEdit={true}
            hideDelete={true}
            hideAdd={true}
        />
    );
}

TasksCell.propTypes = {
    row: PropTypes.shape({ original: PropTypes.object.isRequired }).isRequired,
};
