import { useState } from 'react';

import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProjectIdentity } from 'modules/routes';
import PropTypes from 'prop-types';

import CommentsContainer from './CommentsContainer';

/**
 * Edits task assignments, workflow state, and comments using existing permission checks.
 * @param {Object} props - Task, interview, user choices, scope, and Redux save action.
 * @returns {React.ReactElement} Task workflow form.
 */
export default function Task({ task, interview, users, scope, submitData }) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const { projectDbId } = useProjectIdentity();
    const { isAuthorized } = useAuthorization();

    const [thisTask, setThisTask] = useState({
        id: task.id,
        user_id: task.user_id,
        supervisor_id: task.supervisor_id,
    });

    const usersAsOptionsForSelect = (attribute) => {
        let opts =
            users
                ?.filter((u) => {
                    return (
                        // supervisor-select
                        (attribute === 'supervisor_id' &&
                            !!Object.values(u.user_roles).find((r) => {
                                return (
                                    [
                                        'Qualitätsmanagement',
                                        'QM',
                                        'Archivmanagement',
                                    ].indexOf(r.name) > -1 &&
                                    r.project_id === projectDbId
                                );
                            })) ||
                        // assigned-user-select
                        (attribute === 'user_id' &&
                            !!Object.values(u.user_roles).find((r) => {
                                return (
                                    ['Redaktion', 'Archivmanagement'].indexOf(
                                        r.name
                                    ) > -1 && r.project_id === projectDbId
                                );
                            }))
                    );
                })
                .sort(
                    (a, b) =>
                        `${b.last_name}${b.first_name}` <
                        `${a.last_name}${a.first_name}`
                )
                .map((user, index) => {
                    return (
                        <option
                            value={user.id}
                            key={`${attribute}-option-${index}`}
                        >
                            {`${user.last_name}, ${user.first_name}`}
                        </option>
                    );
                }) || [];
        opts.unshift(
            <option value="" key={`${scope}-choose`}>
                {t('choose')}
            </option>
        );
        return opts;
    };

    const workflowStatesAsOptionsForSelect = () => {
        let opts = task.workflow_states.map((workflowState, index) => {
            return (
                <option
                    value={workflowState}
                    key={`${workflowState}-option-${index}`}
                >
                    {t(`workflow_states.${workflowState}`)}
                </option>
            );
        });
        opts.unshift(
            <option value="" key={`${scope}-choose`}>
                {t('choose')}
            </option>
        );
        return opts;
    };

    const value = (attribute) => {
        let v, user;
        if (/^\d+$/.test(task[attribute])) {
            user = users?.find((u) => u.id === task[attribute]);
            v = (user && `${user.last_name}, ${user.first_name}`) || 'NA';
        } else if (task[attribute]) {
            v = t(`workflow_states.${task[attribute]}`);
        } else {
            v = 'NA';
        }
        return <div className={attribute}>{v}</div>;
    };

    const select = (attribute, options) => {
        if (
            // if the task is one of this users tasks
            (attribute === 'workflow_state' &&
                (task.workflow_state === 'created' ||
                    task.workflow_state === 'started' ||
                    task.workflow_state === 'restarted') &&
                isAuthorized(task, 'update')) ||
            // if the user has the permission to assign tasks
            isAuthorized({ type: 'Task' }, 'assign')
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
                    onChange={(event) =>
                        setThisTask(
                            Object.assign({}, thisTask, {
                                [event.target.name]: event.target.value,
                                id: task.id,
                            })
                        )
                    }
                >
                    {options}
                </select>
            );
        } else {
            return null;
        }
    };

    const valueAndSelect = (attribute, options) => {
        return (
            <div>
                {value(attribute)}
                {select(attribute, options)}
            </div>
        );
    };

    const box = (value, width = '17-5') => {
        return <div className={`box box-${width}`}>{value}</div>;
    };

    return (
        <div
            className="data boxes"
            key={`${interview.archive_id}-${task.id}-tasks-boxes`}
        >
            <form
                className={'task-form'}
                key={`form-${task.id}`}
                onSubmit={(event) => {
                    event.preventDefault();
                    submitData({ pathBase }, { task: thisTask });
                }}
            >
                {box(task.task_type.name[locale])}
                {box(
                    valueAndSelect(
                        'supervisor_id',
                        usersAsOptionsForSelect('supervisor_id')
                    )
                )}
                {box(
                    valueAndSelect(
                        'user_id',
                        usersAsOptionsForSelect('user_id')
                    )
                )}
                {box(
                    valueAndSelect(
                        'workflow_state',
                        workflowStatesAsOptionsForSelect()
                    )
                )}
                <input type="submit" value={t('submit')} />
            </form>
            <AuthorizedContent object={task} action="update">
                <button
                    type="button"
                    onClick={() => {
                        setThisTask({
                            id: task.id,
                            user_id: null,
                            supervisor_id: null,
                        });
                        submitData(
                            { pathBase },
                            {
                                task: {
                                    id: task.id,
                                    //user_id: task.user_id,
                                    //supervisor_id: task.supervisor_id,
                                    workflow_state: 'reset',
                                },
                            }
                        );
                    }}
                >
                    {t('reset')}
                </button>
            </AuthorizedContent>
            <AuthorizedContent object={task} action="update">
                {box(
                    <CommentsContainer
                        data={task.comments}
                        task={task}
                        initialFormValues={{
                            ref_id: task.id,
                            ref_type: 'Task',
                        }}
                    />,
                    '30'
                )}
            </AuthorizedContent>
        </div>
    );
}

Task.propTypes = {
    task: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    users: PropTypes.array,
    scope: PropTypes.string,
    submitData: PropTypes.func.isRequired,
};
