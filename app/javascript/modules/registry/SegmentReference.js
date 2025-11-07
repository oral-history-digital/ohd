import PropTypes from 'prop-types';

import { LinkOrA } from 'modules/routes';
import { formatTimecode, TapeAndTime } from 'modules/interview-helpers';

export default function SegmentReference({
    project,
    segmentRef,
}) {
    const timecode = formatTimecode(segmentRef.time, true);

    return (
        <LinkOrA
            project={project}
            to={`interviews/${segmentRef.archive_id}`}
            className="small"
            params={`tape=${segmentRef.tape_nbr}&time=${timecode}`}
        >
            <TapeAndTime
                tape={segmentRef.tape_nbr}
                time={segmentRef.time}
                transcriptCoupled={segmentRef.transcript_coupled}
            />
        </LinkOrA>
    );
}

SegmentReference.propTypes = {
    segmentRef: PropTypes.object.isRequired,
};
