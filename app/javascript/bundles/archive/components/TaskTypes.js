import React from 'react';
import {Link} from 'react-router-dom';
import TaskTypeContainer from '../containers/TaskTypeContainer';
import { t, pathBase } from '../../../lib/utils';

export default class TaskTypes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };
    }

    toggleButton() {
        return (
            <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, this.state.collapsed ? 'show' : 'hide')}
                onClick={() => this.setState({ collapsed: !this.state.collapsed })}
            >
                <i className={`fa fa-angle-${this.state.collapsed ? 'down' : 'up'}`}></i>
            </span>
        )
    }

    box(value) {
        return (
            <div className='box-8'>
                {value}
            </div>
        )
    }

    task(taskType, interview) {
        return Object.values(interview.tasks).filter(task => task.task_type_id === taskType.id);
    }

    symbol(taskType, interview) {
        let task = this.task(taskType, interview);
        let workflowState = interview.properties.public_attributes[taskType.key] ? 'public' : ((task && task.workflow_state) || 'not_started')
        return (
            <span className={workflowState} key={`task-symbol-${interview.archive_id}-${taskType.id}`} >
                {taskType.abreviation}
            </span>
        )
    }

    symbols() {
        return (
            <div className='workflow-symbols'>
                {Object.values(this.props.project.task_types).map((taskType, index) => {
                    return this.symbol(taskType, this.props.interview);
                })}
                {this.toggleButton()}
            </div>
        );
    }

    fullView() {
        if (!this.state.collapsed) {
            return (
                <div>
                    {Object.values(this.props.project.task_types).map((taskType, index) => {
                        return <TaskTypeContainer task={this.task(taskType, this.props.interview)} interview={this.props.interview} />
                    })}
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.symbols()}
                {this.fullView()}
            </div>
        )
    }
}
