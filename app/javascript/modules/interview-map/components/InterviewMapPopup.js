import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { getArchiveId } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { TapeAndTime } from 'modules/interview-helpers';
import useInterviewMapReferences from '../useInterviewMapReferences';

export default function InterviewMapPopup({
    title,
    registryEntryId,
    onUpdate = f => f,
}) {
    const { t } = useI18n();
    const archiveId = useSelector(getArchiveId);
    const dispatch = useDispatch();
    const { isLoading, personReferences, segmentReferences, error } = useInterviewMapReferences(archiveId, registryEntryId);

    useEffect(() => {
        onUpdate();
    }, [personReferences, segmentReferences]);

    function handleClick(tape, time, transcriptCoupled) {
        transcriptCoupled && dispatch(sendTimeChangeRequest(tape, time));
    }

    return (
        <div className="MapPopup">
            <h3 className="MapPopup-heading">{title}</h3>
            {
                isLoading && <Spinner small />
            }
            {
                error && (
                    <p>
                        {t('modules.interview_map.error_references')}: {error.message}
                    </p>
                )
            }
            {
                personReferences && personReferences.length > 0 && (
                    <ul className="MapPopup-list">
                        {
                            personReferences.map(ref => (
                                <li
                                    key={ref.id}
                                    className="MapPopup-text"
                                >
                                    {ref.label}
                                </li>
                            ))
                        }
                    </ul>
                )
            }
            {
                segmentReferences && segmentReferences.length > 0 && (
                    <>
                        <h4 className="MapPopup-subHeading">
                            {t('modules.interview_map.segment_references')} ({segmentReferences.length})
                        </h4>
                        <ul className="MapPopup-list">
                            {
                                segmentReferences.map(ref => (
                                    <li key={ref.id}>
                                        <button
                                            type="button"
                                            className="Button MapPopup-button"
                                            onClick={() => handleClick(ref.tape_nbr, ref.time, ref.transcript_coupled)}
                                        >
                                            <TapeAndTime tape={ref.tape_nbr} time={ref.time} transcriptCoupled={ref.transcript_coupled} />
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </>
                )
            }
        </div>
    );
}

InterviewMapPopup.propTypes = {
    title: PropTypes.string.isRequired,
    registryEntryId: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
};
