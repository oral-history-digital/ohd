import { Component } from 'react';

import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import CommentsContainer from './CommentsContainer';

export default class Task extends Component {

    constructor(props) {
        super(props);
        this.state = {
            task: {
                id: this.props.task.id,
                user_account_id: this.props.task.user_account_id,
                supervisor_id: this.props.task.supervisor_id,
                //workflow_state: this.props.task.workflow_state
            }
        };
    }

    usersAsOptionsForSelect(attribute) {
        let opts = Object.values(this.props.userAccounts).
            filter(u =>
                (
                    // supervisor-select
                    attribute === 'supervisor_id' &&
                    (!!Object.values(u.user_roles).find(r => ['Qualitätsmanagement', 'QM', 'Archivmanagement'].indexOf(r.name) > -1) || u.admin)
                ) ||
                (
                    // assigned-user-select
                    attribute === 'user_account_id' &&
                    (
                        !!Object.values(u.user_roles).find(r => ['Qualitätsmanagement', 'QM', 'Redaktion', 'Erschließung', 'Archivmanagement'].indexOf(r.name) > -1) ||
                        u.admin
                    )
                )
            ).
            sort((a, b) => `${b.last_name}${b.first_name}` < `${a.last_name}${a.first_name}`).
            map((userAccount, index) => {
            return (
                <option value={userAccount.id} key={`${attribute}-option-${index}`}>
                    {`${userAccount.last_name}, ${userAccount.first_name}`}
                </option>
            )
        })
        opts.unshift(
            <option value='' key={`${this.props.scope}-choose`}>
                {t(this.props, 'choose')}
            </option>
        )
        return opts;
    }

    workflowStatesAsOptionsForSelect() {
        let opts = this.props.task.workflow_states.map((workflowState, index) => {
            return (
                <option value={workflowState} key={`${workflowState}-option-${index}`}>
                    {t(this.props, `workflow_states.${workflowState}`)}
                </option>
            )
        })
        opts.unshift(
            <option value='' key={`${this.props.scope}-choose`}>
                {t(this.props, 'choose')}
            </option>
        )
        return opts;
    }

    value(attribute) {
        let v, user;
        if (/^\d+$/.test(this.props.task[attribute])) {
            //
            // current_user has the key 'current' in the userAccounts-Hash
            //
            if (this.props.userAccounts['current'].id === parseInt(this.props.task[attribute])) {
                user = this.props.userAccounts['current'];
            } else {
                user = this.props.userAccounts[this.props.task[attribute]];
            }
            v = user && `${user.last_name}, ${user.first_name}` || 'NA';
        } else if (this.props.task[attribute]) {
            v = t(this.props, `workflow_states.${this.props.task[attribute]}`);
        } else {
            v = 'NA';
        }
        return (
            <div className={attribute}>
                 {v}
            </div>
        )
    }

    select(attribute, options) {
        if (
            // if the task is one of this users tasks
            (
                attribute === 'workflow_state' &&
                (
                    this.props.task.workflow_state === 'created' ||
                    this.props.task.workflow_state === 'started' ||
                    this.props.task.workflow_state === 'restarted'
                ) &&
                admin(this.props, this.props.task, 'update')
            ) ||
            // if the user has the permission to assign tasks
            admin(this.props, {type: 'Task'}, 'assign')
        ) {
            return (
                <select
                    key={`select-${this.props.task.id}-${attribute}`}
                    name={attribute}
                    value={this.state.task[attribute] || this.props.task[attribute] || ''}
                    //
                    // strange issue: state.task.id gets lost on second update
                    // therefore it is set again here
                    //
                    onChange={() => this.setState({task: Object.assign({}, this.state.task, {[event.target.name]: event.target.value, id: this.props.task.id})})}
                >
                    {options}
                </select>
            )
        } else {
            return null;
        }
    }

    valueAndSelect(attribute, options) {
        return (
            <div>
                {this.value(attribute)}
                {this.select(attribute, options)}
            </div>
        )
    }

    box(value, width='17-5') {
        return (
            <div className={`box box-${width}`} >
                {value}
            </div>
        )
    }

    render() {
        return (
            <div className='data boxes' key={`${this.props.interview.archive_id}-${this.props.task.id}-tasks-boxes`}>
                <form
                    className={'task-form'}
                    key={`form-${this.props.task.id}`}
                    onSubmit={() => {event.preventDefault(); this.props.submitData(this.props, {task: this.state.task})}}
                >
                    {this.box(this.props.task.task_type.name[this.props.locale])}
                    {this.box(this.valueAndSelect('supervisor_id', this.usersAsOptionsForSelect('supervisor_id')))}
                    {this.box(this.valueAndSelect('user_account_id', this.usersAsOptionsForSelect('user_account_id')))}
                    {this.box(this.valueAndSelect('workflow_state', this.workflowStatesAsOptionsForSelect()))}
                    <input type="submit" value={t(this.props, 'submit')}/>
                </form>
                {this.box(admin(this.props, this.props.task, 'update') &&
                    <CommentsContainer
                        data={this.props.task.comments}
                        task={this.props.task}
                        initialFormValues={{ref_id: this.props.task.id, ref_type: 'Task'}}
                    />, '30'
                )}
            </div>
        );
    }
}
