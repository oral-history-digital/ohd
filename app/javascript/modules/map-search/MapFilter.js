import React from 'react';
import PropTypes from 'prop-types';
import keyBy from 'lodash.keyby';

import typeToColor from './typeToColor';

export default function MapFilter({
    filter,
    mapReferenceTypes,
    toggleMapFilter,
}) {
    if (!mapReferenceTypes) {
        return null;
    }

    const availableTypeIds = mapReferenceTypes.map(type => type.id);
    const typesById = keyBy(mapReferenceTypes, type => type.id);

    return (
        <div className="MapFilter">
            <form className="MapFilter-form">
                {
                    availableTypeIds.map((id, index) => (
                        <label
                            key={id}
                            className="MapFilter-label"
                        >
                            <input
                                className="MapFilter-checkbox"
                                name={typeToColor(id)}
                                type="checkbox"
                                checked={filter.includes(id)}
                                onChange={() => toggleMapFilter(id)}
                            />
                            {`${typesById[id].name} `}
                            <svg
                                className="MapFilter-icon"
                                viewBox="0 0 100 100"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="50" cy="50" r="40" stroke="none" fill={typeToColor(id)} />
                            </svg>
                        </label>
                    ))
                }
            </form>
            <div>
                <p>
                    2 Referenztypen
                    {' '}
                    <svg
                        className="MapFilter-icon"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="50" cy="50" r="40" stroke="none" fill="grey" />
                    </svg>
                </p>
                <p>
                    3+ Referenztypen
                    {' '}
                    <svg
                        className="MapFilter-icon"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="50" cy="50" r="40" stroke="none" fill="black" />
                    </svg>
                </p>
            </div>
        </div>
    );
}

MapFilter.propTypes = {
    mapReferenceTypes: PropTypes.array,
    filter: PropTypes.array.isRequired,
    toggleMapFilter: PropTypes.func.isRequired,
};
