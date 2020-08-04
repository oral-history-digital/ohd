import React from 'react';
import {Link} from 'react-router-dom';

import AuthShowContainer from '../containers/AuthShowContainer';
import TaskContainer from '../containers/TaskContainer';
import { t, admin, pathBase, getInterviewee } from '../../../lib/utils';

export default class InterviewWorkflowRow extends React.Component {

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

    componentDidMount() {
        //this.loadWithAssociations();
        if(this.props.fulltext) {
            this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.props.fulltext, id: this.props.interview.archive_id});
        }
    }

    componentDidUpdate() {
        //this.loadWithAssociations();
    }

    //loadWithAssociations() {
        //let intervieweeContribution = Object.values(this.props.interview.contributions).find(c => c.contribution_type === 'interviewee');
        //let intervieweeId = intervieweeContribution && intervieweeContribution.person_id;
        //let interviewee = this.props.people[intervieweeId]
        //if (
               //(interviewee && !interviewee.associations_loaded) ||
               //!interviewee
        //) {
            //this.props.fetchData(this.props, 'people', intervieweeId, null, 'with_associations=true');
        //}
    //}

    box(value, width=8) {
        return (
            <div className={`box-${width}`}>
                {value}
            </div>
        )
    }

    intervieweeWithPhoto() {
        return (
            <Link className={'search-result-link box-8'}
                onClick={() => {
                    this.props.setArchiveId(this.props.interview.archive_id);
                    this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.props.fulltext, id: this.props.interview.archive_id});
                    this.props.setTapeAndTime(1, 0);
                }}
                to={pathBase(this.props) + '/interviews/' + this.props.interview.archive_id}
            >
                <img src={this.props.interview.still_url || 'missing_still'} onError={(e)=>{e.target.src=MISSING_STILL}}/>
                <span>
                    {this.props.interview.title[this.props.locale]}
                </span>
            </Link>
        )
    }

    symbol(task) {
        return (
            <span className={task.workflowState} key={`task-symbol-${interview.archive_id}-${task.id}`} title={task.task_type.label[this.props.locale]} >
                {task.task_type.abbreviation}
            </span>
        )
    }

    symbols() {
        return (
            <div className='workflow-symbols'>
                {Object.values(this.props.interview.tasks).map((task, index) => {
                    return this.symbol(task);
                })}
                {this.toggleButton()}
            </div>
        );
    }

    fullView() {
        if (!this.state.collapsed) {
            return (
                <div className='workflow-active'>
                    {Object.values(this.props.interview.tasks).map((task, index) => {
                        return <TaskContainer task={task} interview={this.props.interview} />
                    })}
                </div>
            );
        }
    }

    fullViewHeader() {
        if (!this.state.collapsed) {
            return (
                <div className='workflow-active header'>
                    {this.box(t(this.props, 'activerecord.attributes.task.task_type_id'), 5)}
                    {this.box(t(this.props, 'activerecord.attributes.task.supervisor_id'), 5)}
                    {this.box(t(this.props, 'activerecord.attributes.task.user_account_id'), 5)}
                    {this.box(t(this.props, 'activerecord.attributes.task.comments'), 5)}
                    {this.box(t(this.props, 'activerecord.attributes.task.workflow_state'), 5)}
                </div>
            );
        }
    }

    render() {
        return (
            <div key={`interview-workflow-${this.props.interview.archive_id}`}>
                <div className='search-result data boxes' key={`${this.props.interview.archive_id}-collapsed-view`}>
                    {this.intervieweeWithPhoto()}
                    {this.box(this.props.interview.archive_id)}
                    {this.box(this.props.interview.media_type)}
                    {this.box(this.props.interview.duration_human)}
                    {this.box(this.props.interview.language[this.props.locale])}
                    {this.box(this.props.interview.collection[this.props.locale])}
                    <div className={`box-8 workflow-${this.state.collapsed ? 'inactive' : 'active'}`} >
                        {this.symbols()}
                    </div>
                    {this.box(this.props.interview.workflow_state)}
                </div>
                <div className='search-result data boxes' key={`${this.props.interview.archive_id}-workflow-details`}>
                    {this.fullViewHeader()}
                    {this.fullView()}
                </div>
            </div>
        );
    }
}
