import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import useMapReferences from '../useMapReferences';

export default function MapPopupContent({
    title,
    registryEntryId,
    onUpdate = f => f,
}) {
    const pathBase = usePathBase();

    const { isLoading, referenceGroups, error } = useMapReferences(registryEntryId);

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
        </div>
    );
}

MapPopupContent.propTypes = {
    registryEntryId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
};
