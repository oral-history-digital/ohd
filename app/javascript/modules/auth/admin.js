import permitted from './permitted';

// props should contain:
//   - user ~ getCurrentUser(state)
//   - editView ~ getEditView(state)
//   - project ~ useProject() or getCurrentProject(state)
//
// obj can be the serialized json of e.g. an interview or a segment
//
// but obj can also be sth. like {type: 'Segment', id: 2345, project_id: 1}
// so obj should contain a type and optional id and mostly project_id
//
// action corresponds to methods in rails e.g. 'show', 'update', 'destroy'
//
export default function admin(props, obj={}, action) {
    if (props.user && (props.editView || obj.type === 'Task' || action === 'show')) {

        let activeTasks = Object.values(props.user.tasks).filter(t => t.workflow_state !== 'finished' && t.workflow_state !== 'cleared');
        let activeSupervisedTasks = Object.values(props.user.supervised_tasks).filter(t => t.workflow_state !== 'cleared');

        let activeTasksPermissions = activeTasks.flatMap(t => Object.values(t.permissions));
        let activeSupervisedTasksPermissions = activeSupervisedTasks.flatMap(t => Object.values(t.permissions));

        if (
            props.user.admin ||
            ((obj.type && (obj.id || action) && (!obj.project_id || obj.project_id === props.project.id)) && (
                //
                // if obj is a task of current_user, he/she should be able to edit it
                (
                    obj.type === 'Task' && (
                        !!activeTasks.find(task => task.id === obj.id) ||
                        !!activeSupervisedTasks.find(task => task.id === obj.id)
                    )
                ) ||
                //
                // if obj is a t ref (i.e. a comment) of a task of current_user, he/she should be able to edit it
                (
                    obj.ref_type === 'Task' && (
                        !!activeTasks.find(task => task.id === obj.ref_id) ||
                        !!activeSupervisedTasks.find(task => task.id === obj.ref_id)
                    )
                ) ||
                //
                // if obj.type and/or id correspond to a task-permission and obj.interview_id is the same as task.interview_id, current_user should be able to edit it
                (
                    !!activeTasksPermissions.find(permission => permitted(permission, obj, action)) ||
                    !!activeSupervisedTasksPermissions.find(permission => permitted(permission, obj, action))
                ) ||
                //
                // if obj.type and/or id correspond to a role-permission, current_user should be able to edit it
                (
                    !!Object.values(props.user.user_roles).
                    filter(r => r.project_id === props.project.id).
                    flatMap(r => Object.values(r.role_permissions)).
                    find(permission => {
                        return (
                            permission.klass === obj.type &&
                            permission.action_name === action
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
