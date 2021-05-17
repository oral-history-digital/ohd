import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
                    setReferences(res.body);
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
                    (
                        <ul className="MapPopup-list">
                            {
                                references.map(ref => (
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
                    ) :
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
