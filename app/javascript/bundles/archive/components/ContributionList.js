import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getPeople, getGroupedContributions } from 'modules/data';
import ContributionGroup from './ContributionGroup';
import ContributionContainer from '../containers/ContributionContainer';

export default function ContributionList({
    withSpeakerDesignation,
}) {
    const people = useSelector(getPeople);
    const groupedContributions = useSelector(getGroupedContributions);

    return (
        <ul className="ContributionList">
            {
                groupedContributions?.map(group => (
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
