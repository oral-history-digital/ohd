import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import keyBy from 'lodash.keyby';
import { Link } from 'react-router-dom';
import request from 'superagent';

import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { getMapQuery } from 'modules/search';
import { getMapFilter } from '../selectors';
import groupAndFilterReferences from '../groupAndFilterReferences';
import useMapReferenceTypes from '../useMapReferenceTypes';

export default function MapPopupContent({
    title,
    registryEntryId,
    onUpdate = f => f,
}) {
    const pathBase = usePathBase();
    const query = useSelector(getMapQuery);
    const filter = useSelector(getMapFilter);

    const { mapReferenceTypes } = useMapReferenceTypes();

    const typesById = keyBy(mapReferenceTypes, type => type.id);

    const [references, setReferences] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const path = `${pathBase}/searches/map_references/${registryEntryId}`;

        request.get(path)
            .set('Accept', 'application/json')
            .query(query)
            .end((error, res) => {
                if (error) {
                    setError(error.message);
                } else if (res) {
                    setReferences(res.body);
                }
            });
    }, [pathBase]);

    // Should run when references is updated.
    useEffect(() => {
        onUpdate();
    }, [references]);

    if (error) {
        return (
            <p>{error}</p>
        );
    }

    const groupedReferences = references ? groupAndFilterReferences(references, filter, mapReferenceTypes) : null;

    return (
        <div className="MapPopup">
            <h3 className="MapPopup-heading">{title}</h3>
            {
                groupedReferences !== null ?
                    groupedReferences.map(group => (
                        <div key={group.id}>
                            <h4 className="MapPopup-subHeading">
                                {typesById[group.id].name} ({group.references.length})
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
                    )) :
                    <Spinner small />
            }
        </div>
    );
}

MapPopupContent.propTypes = {
    registryEntryId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
};
