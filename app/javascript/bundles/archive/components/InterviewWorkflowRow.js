import React from 'react';
import {Link} from 'react-router-dom';

import { t, admin, pathBase, getInterviewee } from '../../../lib/utils';

import AuthShowContainer from '../containers/AuthShowContainer';

export default class InterviewWorkflowRow extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadWithAssociations();
        if(this.props.fulltext) {
            this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.props.fulltext, id: this.props.interview.archive_id});
        }
    }

    componentDidUpdate() {
        this.loadWithAssociations();
    }

    loadWithAssociations() {
        let intervieweeContribution = Object.values(this.props.interview.contributions).find(c => c.contribution_type === 'interviewee');
        let intervieweeId = intervieweeContribution && intervieweeContribution.person_id;
        let interviewee = this.props.people[intervieweeId]
        if (
               (interviewee && !interviewee.associations_loaded) ||
               !interviewee
        ) {
            this.props.fetchData(this.props, 'people', intervieweeId, null, 'with_associations=true');
        }
    }

    box(value) {
        return (
            <div className='box-eighth'>
                {value}
            </div>
        )
    }

    intervieweeWithPhoto() {
        return (
            <Link className={'search-result-link box eighth'}
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

    render() {
        return (
            <div className='search-result data boxes' key={`${this.props.interview.archive_id}-boxes`}>
                {this.intervieweeWithPhoto()}
                {this.box(this.props.interview.archive_id)}
                {this.box(this.props.interview.media_type)}
                {this.box(this.props.interview.duration_human)}
                {this.box(this.props.interview.language[this.props.locale])}
                {this.box(this.props.interview.collection[this.props.locale])}
                {this.box(this.props.interview.workflow_state)}
                {this.box(this.props.interview.workflow_state)}
            </div>
        );
    }
}
