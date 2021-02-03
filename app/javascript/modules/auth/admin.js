import permitted from './permitted';

// props should contain:
//   - account ~ state.data.accounts.current
//   - editView ~ state.archive.editView
//
// obj can be the serialized json of e.g. an interview or a segment
//
// but obj can also be sth. like {type: 'Segment', id: 2345} or {type: 'UserRegistration', action: 'update'}
// so obj should contain a type and (id or action)
//
export default function admin(props, obj={}) {
    if (props.account && (props.editView || obj.type === 'Task')) {

        let activeTasks = Object.values(props.account.tasks).filter(t => t.workflow_state !== 'finished' && t.workflow_state !== 'cleared');
        let activeSupervisedTasks = Object.values(props.account.supervised_tasks).filter(t => t.workflow_state !== 'cleared');

        let activeTasksPermissions = activeTasks.flatMap(t => Object.values(t.permissions));
        let activeSupervisedTasksPermissions = activeSupervisedTasks.flatMap(t => Object.values(t.permissions));

        if (
            props.account.admin ||
            ((obj.type && (obj.id || obj.action)) && (
                //
                // if obj is a task of current_user_account, he/she should be able to edit it
                (
                    obj.type === 'Task' && (
                        !!activeTasks.find(task => task.id === obj.id) ||
                        !!activeSupervisedTasks.find(task => task.id === obj.id)
                    )
                ) ||
                //
                // if obj is a t ref (i.e. a comment) of a task of current_user_account, he/she should be able to edit it
                (
                    obj.ref_type === 'Task' && (
                        !!activeTasks.find(task => task.id === obj.ref_id) ||
                        !!activeSupervisedTasks.find(task => task.id === obj.ref_id)
                    )
                ) ||
                //
                // if obj.type and/or id correspond to a task-permission and obj.interview_id is the same as task.interview_id, current_user_account should be able to edit it
                (
                    !!activeTasksPermissions.find(permission => permitted(permission, obj)) ||
                    !!activeSupervisedTasksPermissions.find(permission => permitted(permission, obj))
                ) ||
                //
                // if obj.type and/or id correspond to a role-permission, current_user_account should be able to edit it
                (
                    !!Object.values(props.account.permissions).find(permission => {
                        return (
                            permission.klass === obj.type &&
                            permission.action_name === obj.action
                        )
                    })
                )
            ))
        ) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
