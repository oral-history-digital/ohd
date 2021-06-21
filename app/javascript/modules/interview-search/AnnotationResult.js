import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { getCurrentInterview } from 'modules/data';
import TranscriptResult from './TranscriptResult';

function getSegmentById(segments, segmentId) {
    // Preconditions
    if (typeof segments !== 'object') {
        throw new TypeError('segments argument must be object');
    }
    if (typeof segmentId !== 'number') {
        throw new TypeError('segmentId argument must be number');
    }
    if (typeof segmentId < 0) {
        throw new TypeError('segmentId must not be negative');
    }

    const segmentArray = Object.values(segments);

    const obj = Object.assign.apply(null, [{}].concat(segmentArray));

    const segment = obj[segmentId];

    if (typeof segment === 'undefined') {
        throw new ReferenceError('Segment cannot be found');
    }

    return segment;
}

export default function AnnotationResult({
    data,
}) {
    const interview = useSelector(getCurrentInterview);

    let segment = null;
    const { segments } = interview;

    if (segments) {
        segment = getSegmentById(segments, data.segment_id);
    }

    const { locale } = useI18n();

    const annotationText = data.text[locale];

    return (
        <div
            type="button"
            className="SearchResult"
        >
            <p
                className="SearchResult-text"
                dangerouslySetInnerHTML={{__html: annotationText}}
            />
            {segment && <TranscriptResult data={segment} />}
        </div>
    );
}

AnnotationResult.propTypes = {
    data: PropTypes.object.isRequired,
};
