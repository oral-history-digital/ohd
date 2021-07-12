import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { getArchiveId } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import { Spinner } from 'modules/spinners';
import { TapeAndTime } from 'modules/interview-helpers';
import useInterviewMapReferences from '../useInterviewMapReferences';

export default function InterviewMapPopup({
    title,
    registryEntryId,
    onUpdate = f => f,
}) {
    const archiveId = useSelector(getArchiveId);
    const dispatch = useDispatch();
    const { isLoading, data, error } = useInterviewMapReferences(archiveId, registryEntryId);

    useEffect(() => {
        onUpdate();
    }, [data]);

    function handleClick(tape, time) {
        dispatch(sendTimeChangeRequest(tape, time));
    }

    return (
        <div className="MapPopup">
            <h3 className="MapPopup-heading">{title}</h3>
            {
                isLoading && <Spinner small />
            }
            <h4 className="MapPopup-subHeading">
                Verknüpfungen
            </h4>
            <h4 className="MapPopup-subHeading">
                Erwähnungen im Transkript
            </h4>
            <ul className="MapPopup-list">
                {
                    data && data.map(ref => (
                        <li key={ref.id}>
                            {
                                ref.label ?
                                    (
                                        <span style={{ color: ref.map_color }}>{ref.label}</span>
                                    ) :
                                    (
                                        <span>
                                            Erwähnung in
                                            {' '}
                                            <button
                                                type="button"
                                                onClick={() => handleClick(ref.tape_nbr, ref.time)}
                                            >
                                                <TapeAndTime tape={ref.tape_nbr} time={ref.time} />
                                            </button>
                                        </span>
                                    )
                            }
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

InterviewMapPopup.propTypes = {
    title: PropTypes.string.isRequired,
    registryEntryId: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
};
