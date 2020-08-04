import React from 'react';
import {Link} from 'react-router-dom';
import Form from '../containers/form/Form';
import { t, pathBase } from '../../../lib/utils';

export default class Task extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            user_account_id: this.props.task.user_account_id,
            supervisor_id: this.props.task.supervisor_id,
            workflow_state: this.props.task.workflow_state
        };
        this.setEditing = this.setEditing.bind(this);
    }

    setEditing() {
        this.setState({editing: !this.state.editing});
    }

    usersAsOptionsForSelect(attribute) {
        let opts = Object.values(this.props.userAccounts).map((userAccount, index) => {
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

    handleChange(event) {
        const value =  event.target.value;
        const name =  event.target.name;
        this.setState({[name]: value});
    }

    value(attribute) {
        let v;
        if (/^\d+$/.test(this.state[attribute])) { 
            let user = this.props.userAccounts[this.state[attribute]];
            v = user && `${user.last_name}, ${user.first_name}` || 'NA';
        } else if (this.state[attribute]) {
            v = t(this.props, `workflow_states.${this.state[attribute]}`);
        } else {
            v = 'NA';
        }
        return (
            <div className={attribute}>
                 {v}
            </div>
        )
    }

    form(attribute, options) {
        return (
            <form 
                className={'task-form'} 
                key={`form-${this.props.task.id}-${attribute}`}
                onSubmit={() => {event.preventDefault(); this.props.submitData(this.props, {task: {id: this.props.task.id, [attribute]: this.state[attribute]}})}}
            >
                <select
                    name={attribute}
                    value={this.state[attribute] || this.props.task[attribute] || ''}
                    onChange={() => this.setState({[event.target.name]: event.target.value})}
                >
                    {options}
                </select>
                <input type="submit" value={t(this.props, 'submit')}/>
            </form>
        )
    }

    valueAndForm(attribute, options) {
        return (
            <div>
                {this.value(attribute)}
                {this.form(attribute, options)}
            </div>
        )
    }

    box(value) {
        return (
            <div className='box-5'>
                {value}
            </div>
        )
    }

    render() {
        return (
            <div className='data boxes' key={`${this.props.interview.archive_id}-${this.props.task.id}-tasks-boxes`}>
                {this.box(this.props.task.task_type.name[this.props.locale])}
                {this.box(this.valueAndForm('user_account_id', this.usersAsOptionsForSelect('user_account_id')))}
                {this.box(this.valueAndForm('supervisor_id', this.usersAsOptionsForSelect('supervisor_id')))}
                {this.box(this.props.task.name)}
                {this.box(this.valueAndForm('workflow_state', this.workflowStatesAsOptionsForSelect()))}
            </div>
        );
    }
}
