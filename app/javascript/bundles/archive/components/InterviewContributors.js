import React from 'react';
import PropTypes from 'prop-types';

import ContributionFormContainer from '../containers/ContributionFormContainer';
import ContributionContainer from '../containers/ContributionContainer';
import AuthorizedContent from './AuthorizedContent';
import { t, admin } from 'lib/utils';

export default class InterviewContributors extends React.Component {
    contributors() {
        const { interview, people, withSpeakerDesignation, contributorsFetched } = this.props;

        let contributionTypes = {};

        if (this.props.contributionTypes && contributorsFetched) {
            for (var c in interview.contributions) {
                let contribution = interview.contributions[c];
                if (
                    withSpeakerDesignation ||
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
                            person={people[contribution.person_id]}
                            contribution={contribution} key={`contribution-person-${contribution.id}`}
                            withSpeakerDesignation={withSpeakerDesignation}
                        />
                    )
                }
            }
        }

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
        ].map((key) => {
            if (contributionTypes[key]) {
                return (
                  <p key={key}>
                    {contributionTypes[key]}
                  </p>
                );
            } else {
                return null;
            }
        })
    }

    addContribution() {
        const { interview, withSpeakerDesignation, submitData, openArchivePopup } = this.props;

        return (
            <AuthorizedContent object={{type: 'Contribution', action: 'create', interview_id: interview.id}}>
                <p>
                    <button
                        type="button"
                        className='flyout-sub-tabs-content-ico-link'
                        onClick={() => openArchivePopup({
                            title: t(this.props, 'edit.contribution.new'),
                            content: <ContributionFormContainer
                                interview={interview}
                                submitData={submitData}
                                withSpeakerDesignation={withSpeakerDesignation}
                            />
                        })}
                    >
                        <i className="fa fa-plus"></i> {t(this.props, 'edit.contribution.new')}
                    </button>
                </p>
            </AuthorizedContent>
        );
    }

    render() {
        const { interview } = this.props;

        if (interview) {
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

InterviewContributors.propTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    withSpeakerDesignation: PropTypes.bool.isRequired,
    interview: PropTypes.object.isRequired,
    contributorsFetched: PropTypes.bool.isRequired,
    people: PropTypes.object.isRequired,
    contributionTypes: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
};

InterviewContributors.defaultProps = {
    withSpeakerDesignation: false,
};
