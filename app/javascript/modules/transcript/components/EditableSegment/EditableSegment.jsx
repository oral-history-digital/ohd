import classNames from 'classnames';
import { formatTimecode } from 'modules/interview-helpers';
import { useScrollOffset } from 'modules/media-player';
import { useTranscriptQueryString } from 'modules/query-string';
import PropTypes from 'prop-types';
import { memo, useRef } from 'react';
import { useAutoScrollToRef } from '../../hooks';
import Initials from './Initials';
import SegmentText from './SegmentText';

function Segment({
    segment,
    interview,
    contributor,
    contentLocale,
    isActive,
    autoScroll,
    sendTimeChangeRequest,
}) {
    const divEl = useRef();
    const { segment: segmentParam } = useTranscriptQueryString();
    const scrollOffset = useScrollOffset();

    const shouldScroll =
        (autoScroll && isActive) || // Segment is active and autoScroll is enabled (e.g. during playback)
        segmentParam === segment.id || // Segment is targeted by the URL param (segmentParam === data.id)
        (isActive && !segmentParam && autoScroll); // Segment is initially active and autoScroll is enabled, but no segmentParam is present

    // Use custom hook for auto-scroll logic
    useAutoScrollToRef(divEl, scrollOffset, shouldScroll, [
        autoScroll,
        isActive,
        segment.id,
        segmentParam,
    ]);

    const handleSegmentClick = () => {
        if (interview?.transcriptCoupled) {
            sendTimeChangeRequest(segment.tape_nbr, segment.time);
        }
    };

    return (
        <div
            id={`segment_${segment.id}`}
            data-tape={segment.tape_nbr}
            data-time={formatTimecode(segment.time, true)}
            ref={divEl}
            className={classNames('Segment', {
                'Segment--withSpeaker': segment.speakerIdChanged,
                'is-active': isActive,
            })}
        >
            <Initials contributor={contributor} segment={segment} />
            <SegmentText
                segment={segment}
                locale={contentLocale}
                isActive={isActive}
                handleClick={handleSegmentClick}
            />
        </div>
    );
}

Segment.propTypes = {
    segment: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    contributor: PropTypes.object,
    contentLocale: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    autoScroll: PropTypes.bool,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};

const MemoizedSegment = memo(Segment);

export default MemoizedSegment;
