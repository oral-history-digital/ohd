import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentProject } from 'modules/data';
import { TasksContainer } from 'modules/workflow';

export default function TasksCell({
    row,
}) {
    const project = useSelector(getCurrentProject);
    const user = row.original;
    const tasks = Object.values(user.tasks).filter(t => t.project_id === project.id);

    return (
        <TasksContainer
            data={tasks}
            initialFormValues={{user_id: user.id}}
            hideEdit={true}
            hideDelete={true}
            hideAdd={true}
        />
    );
}

TasksCell.propTypes = {
    getValue: PropTypes.object.isRequired,
};
