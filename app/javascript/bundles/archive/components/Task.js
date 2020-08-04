import React from 'react';
import {Link} from 'react-router-dom';
import Form from '../containers/form/Form';
import { t, pathBase } from '../../../lib/utils';

export default class Task extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        };
        this.setEditing = this.setEditing.bind(this);
    }

    setEditing() {
        this.setState({editing: !this.state.editing});
    }

    usersAsOptionsForSelect(attribute) {
        return Object.values(this.props.userAccounts).map((userAccount, index) => {
            return (
                <option value={userAccount.id} key={`${attribute}-option-${index}`}>
                    {`${userAccount.last_name}, ${userAccount.first_name}`}
                </option>
            )
        })
    }

    workflowStatesAsOptionsForSelect() {
        return this.props.task.workflow_states.map((workflowState, index) => {
            return (
                <option value={workflowState} key={`${workflowState}-option-${index}`}>
                    {t(this.props, `workflow_states.${workflowState}`)}
                </option>
            )
        })
    }

    form(attribute, options) {
        return (
            <form 
                className={'task-form'} 
                key={`form-${this.props.task.id}-${attribute}`}
            >
                <select
                    name={attribute}
                    value={this.props.task[attribute]}
                >
                    {options}
                </select>
            </form>
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
                {this.box(this.form('user_account_id', this.usersAsOptionsForSelect('user_account_id')))}
                {this.box(this.form('supervisor_id', this.usersAsOptionsForSelect('supervisor_id')))}
                {this.box(this.props.task.name)}
                {this.box(this.form('workflow_state', this.workflowStatesAsOptionsForSelect()))}
            </div>
        );
    }
}
