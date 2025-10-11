import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getCurrentIntervieweeId, getCurrentInterview } from 'modules/data';

export default function MediaPlayerTitle({
    className
}) {
    const intervieweeId = useSelector(getCurrentIntervieweeId);
    const interview = useSelector(getCurrentInterview);

    const interviewee = interview.contributors?.[intervieweeId];

    return (
        <h1 className={className}>
            {interviewee?.display_name}
        </h1>
    );
}

MediaPlayerTitle.propTypes = {
    className: PropTypes.string,
};
