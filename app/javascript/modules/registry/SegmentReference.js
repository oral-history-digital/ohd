import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { LinkOrA } from 'modules/routes';
import { formatTimecode, TapeAndTime } from 'modules/interview-helpers';
import { usePathBase } from 'modules/routes';
import { setArchiveId } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';

export default function SegmentReference({
    project,
    segmentRef,
    onSubmit,
}) {
    const dispatch = useDispatch();
    const pathBase = usePathBase();
    const timecode = formatTimecode(segmentRef.time, true);

    const onLinkClick = () => {
        dispatch(setArchiveId(segmentRef.archive_id));

        if (segmentRef.transcript_coupled) {
            dispatch(sendTimeChangeRequest(segmentRef.tape_nbr, segmentRef.time));
        }
        if (typeof onSubmit === 'function') {
            onSubmit();
        }
    }

    return (
        <LinkOrA
            project={project}
            to={`interviews/${segmentRef.archive_id}`}
            onLinkClick={() => onLinkClick()}
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
    onSubmit: PropTypes.func,
};
