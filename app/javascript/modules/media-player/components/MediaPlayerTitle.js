import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getCurrentIntervieweeId } from 'modules/data';
import { usePeople } from 'modules/person';
import { Spinner } from 'modules/spinners';

export default function MediaPlayerTitle({
    className
}) {
    const intervieweeId = useSelector(getCurrentIntervieweeId);
    const { data: peopleData, isLoading } = usePeople();

    if (isLoading) {
        return <Spinner small />;
    }

    const interviewee = peopleData[intervieweeId];

    return (
        <h1 className={className}>
            {interviewee.display_name}
        </h1>
    );
}

MediaPlayerTitle.propTypes = {
    className: PropTypes.string,
};
