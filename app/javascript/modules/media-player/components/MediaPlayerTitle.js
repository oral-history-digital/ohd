import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getCurrentIntervieweeId, getCurrentInterview } from 'modules/data';
import { useInterviewContributors } from 'modules/person';
import { Spinner } from 'modules/spinners';
import Skeleton from 'react-loading-skeleton';

export default function MediaPlayerTitle({ className }) {
    const interview = useSelector(getCurrentInterview);
    const intervieweeId = useSelector(getCurrentIntervieweeId);
    const {
        data: peopleData,
        isLoading,
        isValidating,
    } = useInterviewContributors(interview.id);

    if (isLoading || isValidating) {
        return <Spinner size="small" />;
    }

    const interviewee = peopleData?.[intervieweeId];

    return (
        <h1 className={className}>
            {interviewee?.display_name || <Skeleton />}
        </h1>
    );
}

MediaPlayerTitle.propTypes = {
    className: PropTypes.string,
};
