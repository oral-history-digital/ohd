import React from 'react';
import {Link} from 'react-router-dom';
import TaskTypeContainer from '../containers/TaskTypeContainer';
import { t, pathBase } from '../../../lib/utils';

export default class TaskTypes extends React.Component {

    box(value) {
        return (
            <div className='box-8'>
                {value}
            </div>
        )
    }

    toggleButton() {
    }

    task(taskType, interview) {
        return Object.values(interview.tasks).filter(task => task.task_type_id === taskType.id);
    }

    symbol(taskType, interview) {
        let task = this.task(taskType, interview);
        return (
            <span key={`task-symbol-${interview.archive_id}-${taskType.id}`} >
                {t(this.props, ((task && task.workflow_state) || 'not_started'))}
            </span>
        )
    }

    symbols() {
        return (
            <div>
                {Object.values(this.props.project.task_types).map((taskType, index) => {
                    return this.symbol(taskType, this.props.interview);
                })}
                {this.toggleButton()}
            </div>
        );
    }

    fullView() {
        return (
            <div>
                {Object.values(this.props.project.task_types).map((taskType, index) => {
                    return <TaskTypeContainer task={this.task(taskType, this.props.interview)} interview={this.props.interview} />
                })}
            </div>
        );
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
