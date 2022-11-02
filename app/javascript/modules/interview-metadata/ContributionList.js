import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getGroupedContributions } from 'modules/data';
import { usePeople } from 'modules/person';
import { Spinner } from 'modules/spinners';
import ContributionGroup from './ContributionGroup';
import ContributionContainer from './ContributionContainer';

export default function ContributionList({
    withSpeakerDesignation = false,
}) {
    const { data: people, isLoading } = usePeople();
    const groupedContributions = useSelector(getGroupedContributions);

    if (isLoading) {
        return (<Spinner />);
    }

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
    withSpeakerDesignation: PropTypes.bool,
};
