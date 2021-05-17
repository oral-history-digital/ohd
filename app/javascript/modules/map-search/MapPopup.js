import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash.groupby';
import { Link } from 'react-router-dom';
import request from 'superagent';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';

export default function MapPopup({
    name,
    registryEntryId,
    query,
}) {
    const pathBase = usePathBase();
    const { locale } = useI18n();

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
                    const groupedReferences = groupBy(res.body, ref => ref.registry_reference_type_id);
                    setReferences(groupedReferences);
                }
            });
    }, [pathBase]);

    if (error) {
        return (
            <p>{error}</p>
        );
    }

    return (
        <div className="MapPopup">
            <h3 className="MapPopup-heading">{name}</h3>
            {
                references !== null ?
                    Object.keys(references).map(type => (
                        <div key={type}>
                            <h4 className="MapPopup-subHeading">
                                Typ {type} ({references[type].length})
                            </h4>
                            <ul className="MapPopup-list">
                                {
                                    references[type].map(ref => (
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

MapPopup.propTypes = {
    registryEntryId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
};
