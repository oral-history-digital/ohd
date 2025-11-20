import { getCurrentInterview, getCurrentIntervieweeId } from 'modules/data';
import { useInterviewContributors } from 'modules/person';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';

export default function MediaPlayerTitle({ className }) {
    const interview = useSelector(getCurrentInterview);
    const intervieweeId = useSelector(getCurrentIntervieweeId);
    const {
        data: peopleData,
        isLoading,
        isValidating,
    } = useInterviewContributors(interview.id);

    // Default to a skeleton while loading
    let displayTitle = (
        <Skeleton baseColor="#373737" highlightColor="#4f4f4f" />
    );

    if (!isLoading && !isValidating && peopleData) {
        displayTitle = peopleData?.[intervieweeId]?.display_name;
    }

    return <h1 className={className}>{displayTitle}</h1>;
}

MediaPlayerTitle.propTypes = {
    className: PropTypes.string,
};
