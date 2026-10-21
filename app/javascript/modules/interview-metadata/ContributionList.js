import { useAuthorization, useProjectAccessStatus } from 'modules/auth';
import { getGroupedContributions } from 'modules/data';
import { useInterviewContributors } from 'modules/person';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import ContributionContainer from './ContributionContainer';
import ContributionGroup from './ContributionGroup';

/**
 * Displays interview contributors grouped by type, respecting project access and contribution editing rights.
 *
 * @param {Object} props - Interview contributor display options.
 * @param {Object} props.interview - Interview whose contributors are displayed.
 * @param {boolean} [props.withSpeakerDesignation=false] - Whether contributor rows show speaker controls.
 * @returns {React.ReactElement} Contribution groups or a loading indicator.
 */
export default function ContributionList({
    withSpeakerDesignation = false,
    interview,
}) {
    const { data: people, isLoading } = useInterviewContributors(interview.id);
    const {
        project,
        isLoading: projectIsLoading,
        error: projectError,
    } = useProject({});
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const groupedContributions = useSelector((state) =>
        getGroupedContributions(
            state,
            !!project &&
                !projectIsLoading &&
                !projectError &&
                projectAccessGranted
        )
    );
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
            {groupedContributions?.map((group) => {
                const contributions = group?.contributions ?? [];

                const visibleCount = contributions.filter(
                    (c) => c.workflow_state === 'public' || authorized
                ).length;

                return (
                    visibleCount > 0 && (
                        <ContributionGroup
                            key={group.type}
                            className="ContributionList-item"
                            contributionType={group.type}
                        >
                            {contributions.map((contribution) => {
                                const person =
                                    people?.[contribution.person_id] ?? null;

                                return (
                                    <ContributionContainer
                                        person={person}
                                        contribution={contribution}
                                        interview={interview}
                                        key={contribution.id}
                                        withSpeakerDesignation={
                                            withSpeakerDesignation
                                        }
                                    />
                                );
                            })}
                        </ContributionGroup>
                    )
                );
            })}
        </ul>
    );
}

ContributionList.propTypes = {
    withSpeakerDesignation: PropTypes.bool,
    interview: PropTypes.object.isRequired,
};
