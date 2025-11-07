import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { TapeAndTime, formatTimecode } from 'modules/interview-helpers';
import useMapReferences from '../map-references/useMapReferences';

export default function SearchMapPopup({
    title,
    registryEntryId,
    onUpdate = f => f,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const dispatch = useDispatch();

    const { isLoading, referenceGroups, segmentRefGroups, numSegmentRefs, error } = useMapReferences(registryEntryId);

    // Should run when references is updated.
    useEffect(() => {
        onUpdate();
    }, [referenceGroups]);

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
                                            <a
                                                href={`${pathBase}/interviews/${ref.archive_id}`}
                                                className="MapPopup-link"
                                            >
                                                {`${ref.display_name} (${ref.archive_id})`}
                                            </a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
            }
            {
                segmentRefGroups?.length > 0 && (
                    <>
                        <h4 className="MapPopup-subHeading">
                            {t('modules.map.mentions')} ({numSegmentRefs})
                        </h4>
                        <ul className="MapPopup-list">
                            {
                                segmentRefGroups.map(refGroup => (
                                    <li key={refGroup.archive_id}>
                                        <h5 className="MapPopup-subSubHeading">
                                            {`${refGroup.display_name} (${refGroup.archive_id})`}
                                        </h5>

                                        <ul className="MapPopup-list">
                                            {
                                                refGroup.refs.map(ref => (
                                                    <li key={ref.id}>
                                                        <a
                                                            className="MapPopup-link MapPopup-link--small"
                                                            href={`${pathBase}/interviews/${ref.archive_id}/?tape=${ref.tape_nbr}&time=${formatTimecode(ref.time, true)}`}
                                                        >
                                                            <TapeAndTime tape={ref.tape_nbr} time={ref.time} transcriptCoupled={ref.transcript_coupled} />
                                                        </a>
                                                    </li>
                                                ))
                                            }
                                        </ul>
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
