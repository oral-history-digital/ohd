import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useAuthorization } from '../hooks/authorization';
import { getCurrentInterview, getContributorsFetched } from '../selectors/dataSelectors';
import { getContributionTypes } from '../selectors/archiveSelectors';
import { getPeople } from '../selectors/dataSelectors';
import ContributionGroup from './ContributionGroup';
import ContributionContainer from '../containers/ContributionContainer';

const CONTRIBUTION_TYPES_USER = [
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
];

const CONTRIBUTION_TYPES_ADMIN = [
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

    const availableTypes = isAuthorized({type: 'General', action: 'edit'}) ?
        CONTRIBUTION_TYPES_ADMIN :
        CONTRIBUTION_TYPES_USER;

    if (!contributionTypes || !contributorsFetched) {
        return null;
    }

    // group by type
    const groupedContributions = Object
        .values(currentInterview.contributions)
        .filter(con => availableTypes.includes(con.contribution_type))
        .reduce((acc, contribution) => {
            const type = contribution.contribution_type;

            if (!acc[type]) {
                acc[type] = [contribution];
            } else {
                acc[type].push(contribution);
            }

            return acc;
        }, {});

    console.log(groupedContributions);

    const groupedAsArray = Object.keys(groupedContributions).map(type => ({
        type,
        contributions: groupedContributions[type],
    }));

    groupedAsArray.sort((a, b) =>
        (availableTypes.indexOf(a.type) - availableTypes.indexOf(b.type))
    );

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
                            group.contributions.map(contribution => (
                                <ContributionContainer
                                    person={people[contribution.person_id]}
                                    contribution={contribution}
                                    key={contribution.id}
                                    withSpeakerDesignation={withSpeakerDesignation}
                                />
                            ))
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
