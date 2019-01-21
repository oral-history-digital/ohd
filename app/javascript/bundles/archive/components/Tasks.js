import React from 'react';

import TaskContainer from '../containers/TaskContainer';
import TaskFormContainer from '../containers/TaskFormContainer';
import { t, admin } from '../../../lib/utils';

export default class Tasks extends React.Component {

    tasks() {
        return Object.keys(this.props.tasks).map((id, index) => {
            return (
                <li key={`user-role-li-${id}`}>
                    <TaskContainer 
                        task={this.props.tasks[id]} 
                        key={`task-${id}`} 
                    />
                </li>
            )
        })
    }

    addTask() {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.task.new')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.task.new'),
                        content: <TaskFormContainer 
                                    userId={this.props.userId}
                                />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <ul className={'user-roles'}>
                    {this.tasks()}
                </ul>
                {this.addTask()}
            </div>
        )
    }
}

