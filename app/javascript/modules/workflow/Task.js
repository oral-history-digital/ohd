import { useState } from 'react';

import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import CommentsContainer from './CommentsContainer';

export default function Task({
    task,
    interview,
    users,
    scope,
    submitData,
}) {

    const { t, locale } = useI18n();
    const { project } = useProject();
    const { isAuthorized } = useAuthorization();

    const [thisTask, setThisTask] = useState({
        id: task.id,
        user_id: task.user_id,
        supervisor_id: task.supervisor_id,
    });

    const usersAsOptionsForSelect = (attribute) => {
        let opts = users?.
            filter(u => {
                return (
                    // supervisor-select
                    attribute === 'supervisor_id' &&
                    (!!Object.values(u.user_roles).find(r => {
                        return (
                            ['Qualitätsmanagement', 'QM', 'Archivmanagement'].indexOf(r.name) > -1 &&
                            r.project_id === project.id
                        )
                    }))
                ) ||
                (
                    // assigned-user-select
                    attribute === 'user_id' &&
                    (!!Object.values(u.user_roles).find(r => {
                        return (
                            ['Redaktion', 'Archivmanagement'].indexOf(r.name) > -1 &&
                            r.project_id === project.id
                        )
                    }))
                )
            }).
            sort((a, b) => `${b.last_name}${b.first_name}` < `${a.last_name}${a.first_name}`).
            map((user, index) => {
            return (
                <option value={user.id} key={`${attribute}-option-${index}`}>
                    {`${user.last_name}, ${user.first_name}`}
                </option>
            )
        }) || [];
        opts.unshift(
            <option value='' key={`${scope}-choose`}>
                {t('choose')}
            </option>
        )
        return opts;
    }

    const workflowStatesAsOptionsForSelect = () => {
        let opts = task.workflow_states.map((workflowState, index) => {
            return (
                <option value={workflowState} key={`${workflowState}-option-${index}`}>
                    {t(`workflow_states.${workflowState}`)}
                </option>
            )
        })
        opts.unshift(
            <option value='' key={`${scope}-choose`}>
                {t('choose')}
            </option>
        )
        return opts;
    }

    const value = (attribute) => {
        let v, user;
        if (/^\d+$/.test(task[attribute])) {
            user = users?.find(u => u.id === task[attribute]);
            v = user && `${user.last_name}, ${user.first_name}` || 'NA';
        } else if (task[attribute]) {
            v = t(`workflow_states.${task[attribute]}`);
        } else {
            v = 'NA';
        }
        return (
            <div className={attribute}>
                 {v}
            </div>
        )
    }

    const select = (attribute, options) => {
        if (
            // if the task is one of this users tasks
            (
                attribute === 'workflow_state' &&
                (
                    task.workflow_state === 'created' ||
                    task.workflow_state === 'started' ||
                    task.workflow_state === 'restarted'
                ) &&
                isAuthorized(task, 'update')
            ) ||
            // if the user has the permission to assign tasks
            isAuthorized({type: 'Task'}, 'assign')
        ) {
            return (
                <select
                    key={`select-${task.id}-${attribute}`}
                    name={attribute}
                    value={thisTask[attribute] || task[attribute] || ''}
                    //
                    // strange issue: state.task.id gets lost on second update
                    // therefore it is set again here
                    //
                    onChange={() => setThisTask({task: Object.assign({}, thisTask, {[event.target.name]: event.target.value, id: task.id})})}
                >
                    {options}
                </select>
            )
        } else {
            return null;
        }
    }

    const valueAndSelect = (attribute, options) => {
        return (
            <div>
                {value(attribute)}
                {select(attribute, options)}
            </div>
        )
    }

    const box = (value, width='17-5') => {
        return (
            <div className={`box box-${width}`} >
                {value}
            </div>
        )
    }

    return (
        <div className='data boxes' key={`${interview.archive_id}-${task.id}-tasks-boxes`}>
            <form
                className={'task-form'}
                key={`form-${task.id}`}
                onSubmit={() => {event.preventDefault(); submitData({ locale, project }, {task: thisTask})}}
            >
                {box(task.task_type.name[locale])}
                {box(valueAndSelect('supervisor_id', usersAsOptionsForSelect('supervisor_id')))}
                {box(valueAndSelect('user_id', usersAsOptionsForSelect('user_id')))}
                {box(valueAndSelect('workflow_state', workflowStatesAsOptionsForSelect()))}
                <input type="submit" value={t( 'submit')}/>
            </form>
            <AuthorizedContent object={task} action='update'>
                {box(
                    <CommentsContainer
                        data={task.comments}
                        task={task}
                        initialFormValues={{ref_id: task.id, ref_type: 'Task'}}
                    />, '30'
                )}
            </AuthorizedContent>
        </div>
    );
}
