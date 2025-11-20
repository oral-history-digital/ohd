import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { TapeAndTime } from 'modules/interview-helpers';
import { getCurrentInterview } from 'modules/data';
import { sendTimeChangeRequest } from 'modules/media-player';
import getSegmentById from './getSegmentById';

export default function AnnotationResult({ data }) {
    const { t, locale } = useI18n();
    const interview = useSelector(getCurrentInterview);
    const dispatch = useDispatch();

    let segment = null;
    const { segments } = interview;
    if (segments && Object.keys(segments).length > 0) {
        segment = getSegmentById(segments, data.segment_id);
    }

    const annotationText = data.text[locale];

    function handleClick() {
        if (segment && interview.transcript_coupled) {
            dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time));
        }
    }

    return (
        <button type="button" className="SearchResult" onClick={handleClick}>
            <div className="SearchResult-meta">
                {t('modules.interview_search.annotation_for')}{' '}
                {segment ? (
                    <TapeAndTime
                        tape={segment.tape_nbr}
                        time={segment.time}
                        transcriptCoupled={interview.transcript_coupled}
                    />
                ) : (
                    <Spinner small />
                )}
            </div>
            <div
                className="SearchResult-text"
                dangerouslySetInnerHTML={{ __html: annotationText }}
            />
        </button>
    );
}

AnnotationResult.propTypes = {
    data: PropTypes.object.isRequired,
};
