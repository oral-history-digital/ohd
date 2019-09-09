import React from 'react';
import { t, fullname, admin } from '../../../lib/utils';
import ContributionFormContainer from '../containers/ContributionFormContainer';
import PersonContainer from '../containers/PersonContainer';

export default class InterviewContributors extends React.Component {

    contributors() {
        let contributionTypes = {};
        if (
            this.props.interview &&
            this.props.peopleStatus[`contributors_for_interview_${this.props.interview.id}`] &&
            this.props.peopleStatus[`contributors_for_interview_${this.props.interview.id}`].split('-')[0] === 'fetched' && 
            this.props.contributionTypes
        ) {
            for (var c in this.props.interview.contributions) {
                let contribution = this.props.interview.contributions[c];
                if (contribution !== 'fetched' && contribution.contribution_type !== 'interviewee') {
                    if (!contributionTypes[contribution.contribution_type]) {
                        contributionTypes[contribution.contribution_type] = [<span className='flyout-content-label' key={`contribution-label-${contribution.id}`}>{t(this.props, `contributions.${contribution.contribution_type}`)}: </span>];
                    }
                    contributionTypes[contribution.contribution_type].push(<PersonContainer data={this.props.people[contribution.person_id]} contribution={true} key={`contribution-person-${contribution.id}`} />)
                }
            }
        } 
        //return Object.keys(contributionTypes).map((key, index) => {
        return [
            'interviewer', 
            'cinematographer', 
            'transcriptor', 
            'translator', 
            'segmentator', 
            'quality_manager_interviewing',
            'quality_manager_transcription',
            'quality_manager_translation',
            'quality_manager_research',
        ].map((key, index) => {
            if (contributionTypes[key]) {
                return (
                  <div key={`contribution-${index}`}>
                    <p>{contributionTypes[key]}</p>
                  </div>
                );
            } else {
                return null;
            }
        })
    }

    addContribution() {
        if (admin(this.props, {type: 'Contribution', action: 'create'})) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.contribution.new')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.contribution.new'),
                        content: <ContributionFormContainer interview={this.props.interview} submitData={this.props.submitData} />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        }
    }

    render() {
        if (this.props.interview) {
            return (
                <div>
                    {this.contributors()}
                    {this.addContribution()}
                </div>
            );
        } else {
            return null;
        }
    }
}

