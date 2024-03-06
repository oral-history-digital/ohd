import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { TapeAndTime } from 'modules/interview-helpers';
import { usePathBase } from 'modules/routes';
import { setArchiveId } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';

export default function SegmentReference({
    segmentRef,
    onSubmit,
}) {
    const dispatch = useDispatch();
    const pathBase = usePathBase();

    return (
        <Link className="small"
            key={segmentRef.id}
            onClick={() => {
                dispatch(setArchiveId(segmentRef.archive_id));

                if (segmentRef.transcript_coupled) {
                    dispatch(sendTimeChangeRequest(segmentRef.tape_nbr, segmentRef.time));
                }
                if (typeof onSubmit === 'function') {
                    onSubmit();
                }
            }}
            to={pathBase + '/interviews/' + segmentRef.archive_id}
        >
            <TapeAndTime
                tape={segmentRef.tape_nbr}
                time={segmentRef.time}
                transcriptCoupled={segmentRef.transcript_coupled}
            />
        </Link>
    )
}

SegmentReference.propTypes = {
    segmentRef: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
};
