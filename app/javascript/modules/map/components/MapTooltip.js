import PropTypes from 'prop-types';
import { Tooltip } from 'react-leaflet';

import { MARKER_COLOR_SEGMENT_TYPE } from '../constants';

export default function MapTooltip({
    placeName,
    numInterviewRefs,
    numSegmentRefs,
}) {
    let numRefs;
    if (numInterviewRefs === 0) {
        numRefs = (
            <span style={{ color: MARKER_COLOR_SEGMENT_TYPE }}>
                ({numSegmentRefs})
            </span>
        );
    } else if (numSegmentRefs === 0) {
        numRefs = `(${numInterviewRefs})`;
    } else {
        numRefs = (
            <>
                (
                {numInterviewRefs}
                {' / '}
                <span style={{ color: MARKER_COLOR_SEGMENT_TYPE }}>
                    {numSegmentRefs})
                </span>
            </>
        );
    }

    return (
        <Tooltip>
            {placeName}
            {' '}
            {numRefs}
        </Tooltip>
    );
}

MapTooltip.propTypes = {
    placeName: PropTypes.string.isRequired,
    numInterviewRefs: PropTypes.number.isRequired,
    numSegmentRefs: PropTypes.number.isRequired,
};
