import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useAuthorization } from '../hooks/authorization';
import { getCurrentInterview, getContributorsFetched } from '../selectors/dataSelectors';
import { getContributionTypes } from '../selectors/archiveSelectors';
import { getPeople } from '../selectors/dataSelectors';
import ContributionGroup from './ContributionGroup';
import ContributionContainer from '../containers/ContributionContainer';

const CONTRIBUTION_TYPES_ALL = [
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
];

export default function ContributionList({
    withSpeakerDesignation,
}) {
    const currentInterview = useSelector(getCurrentInterview);
    const contributorsFetched = useSelector(getContributorsFetched);
    const people = useSelector(getPeople);
    const contributionTypes = useSelector(getContributionTypes);

    const { isAuthorized } = useAuthorization();

    if (!contributionTypes || !contributorsFetched) {
        return null;
    }

    const interviewContributions = Object.values(currentInterview.contributions);

    // group by contribution type
    const groupedContributions = interviewContributions.reduce((acc, contribution) => {
        const type = contribution.contribution_type;

        if (!acc[type]) {
            acc[type] = [contribution];
        } else {
            acc[type].push(contribution);
        }

        return acc;
    }, {});

    const groupedAsArray = Object.keys(groupedContributions).map(type => {
        return {
            type,
            contributions: groupedContributions[type],
        };
    });

    groupedAsArray.sort((a, b) => {
        return (CONTRIBUTION_TYPES_ALL.indexOf(a.type) - CONTRIBUTION_TYPES_ALL.indexOf(b.type));
    });

    return (
        <ul className="ContributionList">
            {
                groupedAsArray.map(group => (
                    <ContributionGroup
                        key={group.type}
                        className="ContributionList-item"
                        contributionType={group.type}
                    >
                        {
                            group.contributions.map(contribution => {
                                if (withSpeakerDesignation ||
                                    isAuthorized(contribution) ||
                                    contribution.contribution_type !== 'interviewee') {
                                    return (
                                        <ContributionContainer
                                            person={people[contribution.person_id]}
                                            contribution={contribution}
                                            key={contribution.id}
                                            withSpeakerDesignation={withSpeakerDesignation}
                                        />
                                    );
                                }
                            })

                        }
                    </ContributionGroup>
                ))
            }
        </ul>
    );
}

ContributionList.propTypes = {
    withSpeakerDesignation: PropTypes.bool.isRequired,
};

ContributionList.defaultProps = {
    withSpeakerDesignation: false,
};
