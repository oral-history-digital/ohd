import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import missingStill from 'assets/images/missing_still.png';
import { loadIntervieweeWithAssociations } from 'modules/interview-preview';
import { SingleValueWithFormContainer } from 'modules/forms';
import { pathBase } from 'modules/routes';
import { humanReadable } from 'modules/data';
import { t } from 'modules/i18n';
import TaskContainer from './TaskContainer';

export default class InterviewWorkflowRow extends Component {

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
                title={t(this.props, this.state.collapsed ? 'edit_workflow' : 'do_not_edit_workflow')}
                onClick={() => this.setState({ collapsed: !this.state.collapsed })}
            >
                <i className={`fa fa-angle-${this.state.collapsed ? 'down' : 'up'}`}></i>
            </span>
        )
    }

    componentDidMount() {
        this.loadUserAccounts();
        this.loadTasks();
        loadIntervieweeWithAssociations(this.props);
    }

    componentDidUpdate() {
        this.loadUserAccounts();
        this.loadTasks();
        loadIntervieweeWithAssociations(this.props);
    }

    loadUserAccounts() {
        if (
            !this.props.userAccountsStatus.all
        ) {
            this.props.fetchData(this.props, 'accounts');
        }
    }

    loadTasks() {
        if (
            !this.props.tasksStatus[`for_interview_${this.props.interview.archive_id}`]
        ) {
            this.props.fetchData(this.props, 'tasks', null, null, `for_interview=${this.props.interview.archive_id}`);
        }
    }

    box(value, width='17-5') {
        return (
            <div className={`box box-${width}`}>
                {value}
            </div>
        )
    }

    intervieweeWithPhoto() {
        const { interviewee } = this.props;

        if (interviewee && interviewee.names[this.props.locale]) {
            return (
                <Link className={'search-result-link box-10'}
                    onClick={() => {
                        this.props.setArchiveId(this.props.interview.archive_id);
                        this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.props.fulltext, id: this.props.interview.archive_id});
                    }}
                    to={pathBase(this.props) + '/interviews/' + this.props.interview.archive_id}
                >
                    <img
                        className="workflow"
                        src={this.props.interview.still_url || 'missing_still'}
                        onError={(e)=> { e.target.src = missingStill; }}
                    />
                    <span className='workflow' >
                        {interviewee && interviewee.names[this.props.locale].lastname + ', '}<br />
                        {interviewee && interviewee.names[this.props.locale].firstname }
                    </span>
                </Link>
            )
        }
    }

    symbol(task) {
        return (
            <span className={task.workflow_state} key={`task-symbol-${task.id}`} title={task.task_type.label[this.props.locale]} >
                {task.task_type.abbreviation}
            </span>
        )
    }

    symbols() {
        if (
            this.props.tasksStatus[`for_interview_${this.props.interview.archive_id}`] &&
            this.props.tasksStatus[`for_interview_${this.props.interview.archive_id}`].split('-')[0] === 'fetched'
        ) {
            return (
                <div className='workflow-symbols'>
                    {this.props.interview.task_ids.map((taskId, index) => {
                        // using the slightly more complicated way to get task_types' use attribute
                        // (this.props.tasks[taskId].task_type.use would be easier)
                        // otherwise all tasks cache would have to be cleared on project configuration changes
                        //
                        if (this.props.project.task_types[this.props.tasks[taskId].task_type.id].use) {
                            return this.symbol(this.props.tasks[taskId]);
                        }
                    })}
                    {this.toggleButton()}
                </div>
            );
        }
    }

    fullView() {
        if (
            !this.state.collapsed &&
            this.props.tasksStatus[`for_interview_${this.props.interview.archive_id}`] &&
            this.props.tasksStatus[`for_interview_${this.props.interview.archive_id}`].split('-')[0] === 'fetched'
        ) {
            return (
                <div className='workflow-active tasks'>
                    {this.props.interview.task_ids.map((taskId, index) => {
                        if (this.props.project.task_types[this.props.tasks[taskId].task_type.id].use) {
                            return <TaskContainer task={this.props.tasks[taskId]} interview={this.props.interview} />
                        }
                    })}
                </div>
            );
        }
    }

    fullViewHeader() {
        if (!this.state.collapsed) {
            return (
                <div className='workflow-active boxes header'>
                    {this.box(t(this.props, 'activerecord.attributes.task.task_type_id'))}
                    {this.box(t(this.props, 'activerecord.attributes.task.supervisor_id'))}
                    {this.box(t(this.props, 'activerecord.attributes.task.user_account_id'))}
                    {this.box(t(this.props, 'activerecord.attributes.task.workflow_state'))}
                    {this.box(t(this.props, 'activerecord.attributes.task.comments'), 30)}
                </div>
            );
        }
    }

    render() {
        return (
            <div className='border-top' key={`interview-workflow-${this.props.interview.archive_id}`}>
                <div className='search-result-workflow data boxes' key={`${this.props.interview.archive_id}-collapsed-view`}>
                    {this.intervieweeWithPhoto()}
                    {this.box(humanReadable(this.props.interview, 'archive_id', this.props, this.state), '10')}
                    {this.box(humanReadable(this.props.interview, 'media_type', this.props, this.state), '10')}
                    {this.box(humanReadable(this.props.interview, 'duration', this.props, this.state), '10')}
                    {this.box(humanReadable(this.props.interview, 'language_id', this.props, this.state), '10')}
                    {this.box(humanReadable(this.props.interview, 'collection_id', this.props, this.state), '10')}
                    <div className={`box-30 workflow-${this.state.collapsed ? 'inactive' : 'active'}`} >
                        {this.symbols()}
                    </div>
                    {this.box(
                        <SingleValueWithFormContainer
                            elementType={'select'}
                            obj={this.props.interview}
                            attribute={'workflow_state'}
                            values={['public', 'unshared']}
                            optionsScope={'workflow_states'}
                            noStatusCheckbox={true}
                            noLabel={true}
                            withEmpty={true}
                        />, '10'
                    )}
                </div>
                <div className='search-result-workflow-detail data boxes' key={`${this.props.interview.archive_id}-workflow-details`}>
                    {this.fullViewHeader()}
                    {this.fullView()}
                </div>
            </div>
        );
    }
}

InterviewWorkflowRow.propTypes = {
    interviewee: PropTypes.object.isRequired,
};
