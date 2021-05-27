import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import keyBy from 'lodash.keyby';
import { Link } from 'react-router-dom';
import request from 'superagent';

import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { getMapReferenceTypes, getMapFilter } from 'modules/search';
import groupAndFilterReferences from './groupAndFilterReferences';

export default function MapPopupContent({
    name,
    registryEntryId,
    query,
    onUpdate = f => f,
}) {
    const pathBase = usePathBase();
    const referenceTypes = useSelector(getMapReferenceTypes);
    const filter = useSelector(getMapFilter);

    const typesById = keyBy(referenceTypes, type => type.id);

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

    const groupedReferences = references ? groupAndFilterReferences(references, filter) : null;

    return (
        <div className="MapPopup">
            <h3 className="MapPopup-heading">{name}</h3>
            {
                groupedReferences !== null ?
                    Object.keys(groupedReferences).map(type => (
                        <div key={type}>
                            <h4 className="MapPopup-subHeading">
                                {typesById[type].name} ({groupedReferences[type].length})
                            </h4>
                            <ul className="MapPopup-list">
                                {
                                    groupedReferences[type].map(ref => (
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
    name: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
    onUpdate: PropTypes.func,
};
