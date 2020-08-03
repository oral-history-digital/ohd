import React from 'react';
import {Link} from 'react-router-dom';
import { t, pathBase } from '../../../lib/utils';

export default class TaskType extends React.Component {

    box(value) {
        return (
            <div className='box-5'>
                {value}
            </div>
        )
    }

    render() {
        return (
            <div className='data boxes' key={`${this.props.interview.archive_id}-${this.props.taskType.id}-tasks-boxes`}>
                {this.box(this.props.task.name)}
                {this.box('bla')}
                {this.box(this.props.task.name)}
                {this.box(this.props.task.name)}
                {this.box(this.props.task.name)}
            </div>
        );
    }
}
