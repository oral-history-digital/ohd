import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useAuthorization } from 'modules/auth';
import { getGroupedContributions } from 'modules/data';
import { useInterviewContributors } from 'modules/person';
import { Spinner } from 'modules/spinners';
import ContributionContainer from './ContributionContainer';
import ContributionGroup from './ContributionGroup';

export default function ContributionList({
    withSpeakerDesignation = false,
    interview,
}) {
    const { data: people, isLoading } = useInterviewContributors(interview.id);
    const groupedContributions = useSelector(getGroupedContributions);
    const { isAuthorized } = useAuthorization();

    if (isLoading || typeof people === 'undefined') {
        return <Spinner />;
    }

    const authorized = isAuthorized(
        { type: 'Contribution', interview_id: interview.id },
        'update'
    );

    return (
        <ul className="ContributionList">
            {groupedContributions?.map(
                (group) =>
                    group.contributions.filter(
                        (c) => c.workflow_state === 'public' || authorized
                    ).length > 0 && (
                        <ContributionGroup
                            key={group.type}
                            className="ContributionList-item"
                            contributionType={group.type}
                        >
                            {group.contributions.map((contribution) => (
                                <ContributionContainer
                                    person={people[contribution.person_id]}
                                    contribution={contribution}
                                    key={contribution.id}
                                    withSpeakerDesignation={
                                        withSpeakerDesignation
                                    }
                                />
                            ))}
                        </ContributionGroup>
                    )
            )}
        </ul>
    );
}

ContributionList.propTypes = {
    withSpeakerDesignation: PropTypes.bool,
    interview: PropTypes.object.isRequired,
};
