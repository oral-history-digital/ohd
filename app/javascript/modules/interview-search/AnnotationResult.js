import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { getCurrentInterview } from 'modules/data';
import TranscriptResult from './TranscriptResult';
import getSegmentById from './getSegmentById';

export default function AnnotationResult({
    data,
}) {
    const interview = useSelector(getCurrentInterview);

    let segment = null;
    const { segments } = interview;

    if (segments && Object.keys(segments).length > 0) {
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
            {segment ?
                <TranscriptResult data={segment} /> :
                <Spinner small />
            }
        </div>
    );
}

AnnotationResult.propTypes = {
    data: PropTypes.object.isRequired,
};
