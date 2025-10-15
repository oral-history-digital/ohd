import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getGroupedContributions } from 'modules/data';
import { useAuthorization } from 'modules/auth';
import { usePeople } from 'modules/person';
import { Spinner } from 'modules/spinners';
import ContributionGroup from './ContributionGroup';
import ContributionContainer from './ContributionContainer';
import { useProjectAccessStatus } from 'modules/auth';
import { useProject } from 'modules/routes';

export default function ContributionList({
    withSpeakerDesignation = false,
    interview,
}) {
    const { project } = useProject();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const { data: people, isLoading } = usePeople();
    const groupedContributions = useSelector(getGroupedContributions(projectAccessGranted));
    const { isAuthorized } = useAuthorization();

    if (isLoading || typeof people === 'undefined') {
        return (<Spinner />);
    }

    const authorized = isAuthorized({type: 'Contribution', interview_id: interview.id}, 'update');

    return (
        <ul className="ContributionList">
            {
                groupedContributions?.map(group => (
                    group.contributions.filter(c => c.workflow_state === 'public' || authorized).length > 0 && (
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
                    )
                ))
            }
        </ul>
    );
}

ContributionList.propTypes = {
    withSpeakerDesignation: PropTypes.bool,
};
