import React from 'react';
import { t, fullname, admin } from '../../../lib/utils';
import ContributionFormContainer from '../containers/ContributionFormContainer';
import ContributionContainer from '../containers/ContributionContainer';

export default class InterviewContributors extends React.Component {

    contributors() {
        let contributionTypes = {};
        if (
            this.props.interview &&
            (
                (
                    this.props.peopleStatus[`contributors_for_interview_${this.props.interview.id}`] &&
                    this.props.peopleStatus[`contributors_for_interview_${this.props.interview.id}`].split('-')[0] === 'fetched'
                ) || 
                this.props.peopleStatus.all && this.props.peopleStatus.all.split('-')[0] === 'fetched'
            ) &&
            this.props.contributionTypes
        ) {
            for (var c in this.props.interview.contributions) {
                let contribution = this.props.interview.contributions[c];
                if (
                    this.props.withSpeakerDesignation || 
                    admin(this.props, contribution) ||
                    contribution.contribution_type !== 'interviewee' 
                ) {
                    if (!contributionTypes[contribution.contribution_type]) {
                        contributionTypes[contribution.contribution_type] = [
                            <span className='flyout-content-label' key={`contribution-label-${contribution.id}`}>
                                {t(this.props, `contributions.${contribution.contribution_type}`)}:
                            </span>
                        ];
                    }
                    contributionTypes[contribution.contribution_type].push(
                        <ContributionContainer
                            person={this.props.people[contribution.person_id]}
                            contribution={contribution} key={`contribution-person-${contribution.id}`}
                            withSpeakerDesignation={this.props.withSpeakerDesignation}
                        />
                    )
                }
            }
        }
        //return Object.keys(contributionTypes).map((key, index) => {

        return [
            'interviewee',
            'interviewer',
            'cinematographer',
            'sound',
            'producer',
            'other_attender',
            'transcriptor',
            'translator',
            'segmentator',
            'proofreader',
            'research',
            'quality_manager_interviewing',
            'quality_manager_transcription',
            'quality_manager_translation',
            'quality_manager_research',
        ].map((key, index) => {
            if (contributionTypes[key]) {
                return (
                  <p key={`contribution-${index}`}>
                    {contributionTypes[key]}
                  </p>
                );
            } else {
                return null;
            }
        })
    }

    addContribution() {
        if (admin(this.props, {type: 'Contribution', action: 'create', interview_id: this.props.interview.id})) {
            return (
                <p>
                    <span
                        className='flyout-sub-tabs-content-ico-link'
                        title={t(this.props, 'edit.contribution.new')}
                        onClick={() => this.props.openArchivePopup({
                            title: t(this.props, 'edit.contribution.new'),
                            content: <ContributionFormContainer 
                                interview={this.props.interview} 
                                submitData={this.props.submitData} 
                                withSpeakerDesignation={this.props.withSpeakerDesignation}
                            />
                        })}
                    >
                        <i className="fa fa-plus"></i> {t(this.props, 'edit.contribution.new')}
                    </span>
                </p>
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

