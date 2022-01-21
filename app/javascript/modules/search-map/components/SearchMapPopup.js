import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { usePathBase } from 'modules/routes';
import { setArchiveId } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { TapeAndTime } from 'modules/interview-helpers';
import useMapReferences from '../map-references/useMapReferences';

export default function SearchMapPopup({
    title,
    registryEntryId,
    onUpdate = f => f,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const dispatch = useDispatch();

    const { isLoading, referenceGroups, segmentReferences, error } = useMapReferences(registryEntryId);

    // Should run when references is updated.
    useEffect(() => {
        onUpdate();
    }, [referenceGroups]);

    function handleClick(archiveId, tape, time) {
        dispatch(setArchiveId(archiveId));
        dispatch(sendTimeChangeRequest(tape, time));
    }

    if (error) {
        return (
            <p>{error.message}</p>
        );
    }

    return (
        <div className="MapPopup">
            <h3 className="MapPopup-heading">{title}</h3>
            {
                isLoading ?
                    <Spinner small /> :
                    referenceGroups.map(group => (
                        <div key={group.id}>
                            <h4 className="MapPopup-subHeading">
                                {group.name} ({group.references.length})
                            </h4>
                            <ul className="MapPopup-list">
                                {
                                    group.references.map(ref => (
                                        <li key={ref.id}>
                                            <Link
                                                to={`${pathBase}/interviews/${ref.archive_id}`}
                                                className="MapPopup-link"
                                            >
                                                {`${ref.first_name} ${ref.last_name} (${ref.archive_id})`}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
            }
            {
                segmentReferences && segmentReferences.length > 0 && (
                    <>
                        <h4 className="MapPopup-subHeading">
                            {t('modules.interview_map.segment_references')}
                        </h4>
                        <ul className="MapPopup-list">
                            {
                                segmentReferences.map(ref => (
                                    <li
                                        key={ref.id}
                                        className="MapPopup-listItem"
                                    >
                                        <Link className="search-result-link"
                                            onClick={() => handleClick(ref.archive_id, ref.tape_nbr, ref.time)}
                                            to={`${pathBase}/interviews/${ref.archive_id}`}
                                        >
                                            {`${ref.first_name} ${ref.last_name}`}
                                            {', '}
                                            <TapeAndTime tape={ref.tape_nbr} time={ref.time} />
                                        </Link>
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

SearchMapPopup.propTypes = {
    registryEntryId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
};
