import PropTypes from 'prop-types';
import keyBy from 'lodash.keyby';

import { useI18n } from 'modules/i18n';
import { MARKER_COLOR_MULTIPLE_TYPES } from './constants';

export default function MapFilter({
    filter,
    mapReferenceTypes,
    locationCountByReferenceType,
    toggleMapFilter,
}) {
    const { t } = useI18n();

    if (!mapReferenceTypes) {
        return null;
    }

    const availableTypeIds = mapReferenceTypes.map(type => type.id);
    const typesById = keyBy(mapReferenceTypes, type => type.id);

    return (
        <div className="MapFilter">
            <form className="MapFilter-form">
                {
                    availableTypeIds.map(id => {
                        const referenceType = typesById[id];

                        return (
                            <label
                                key={id}
                                className="MapFilter-label"
                            >
                                <input
                                    className="MapFilter-checkbox"
                                    name={referenceType.name}
                                    type="checkbox"
                                    checked={filter.includes(id)}
                                    onChange={() => toggleMapFilter(id)}
                                />
                                {`${referenceType.name} `}
                                <svg
                                    className="MapFilter-icon"
                                    viewBox="0 0 100 100"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke="none"
                                        fill={referenceType.color}
                                    />
                                </svg>
                                {` (${locationCountByReferenceType[id]})`}
                            </label>
                        );
                    })
                }
            </form>
            <div>
                <p>
                    {t('modules.map_filter.multiple_types')}
                    {' '}
                    <svg
                        className="MapFilter-icon"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="50" cy="50" r="40" stroke="none" fill={MARKER_COLOR_MULTIPLE_TYPES} />
                    </svg>
                </p>
            </div>
        </div>
    );
}

MapFilter.propTypes = {
    mapReferenceTypes: PropTypes.array,
    locationCountByReferenceType: PropTypes.object,
    filter: PropTypes.array,
    toggleMapFilter: PropTypes.func.isRequired,
};
