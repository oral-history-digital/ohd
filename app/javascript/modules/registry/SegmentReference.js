import { setArchiveId } from 'modules/archive';
import { TapeAndTime, formatTimecode } from 'modules/interview-helpers';
import { sendTimeChangeRequest } from 'modules/media-player';
import { LinkOrA } from 'modules/routes';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function SegmentReference({ project, segmentRef, onSubmit }) {
    const dispatch = useDispatch();
    const pathBase = usePathBase();
    const timecode = formatTimecode(segmentRef.time, true);

    const onLinkClick = () => {
        dispatch(setArchiveId(segmentRef.archive_id));

        if (segmentRef.transcript_coupled) {
            dispatch(
                sendTimeChangeRequest(segmentRef.tape_nbr, segmentRef.time)
            );
        }
        if (typeof onSubmit === 'function') {
            onSubmit();
        }
    };

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
