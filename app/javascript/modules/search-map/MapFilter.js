import PropTypes from 'prop-types';
import classNames from 'classnames';
import keyBy from 'lodash.keyby';

import { useI18n } from 'modules/i18n';
import useMapReferenceTypes from './useMapReferenceTypes';

const MARKER_COLOR_MULTIPLE_TYPES = 'black';

export default function MapFilter({
    filter,
    locationCountByReferenceType,
    toggleMapFilter,
}) {
    const { t } = useI18n();
    const { mapReferenceTypes } = useMapReferenceTypes();

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
                        const isActive = filter.includes(id);

                        return (
                            <label
                                key={id}
                                className={classNames('MapFilter-label', { 'is-active': isActive })}
                            >
                                <input
                                    className="MapFilter-checkbox"
                                    name={referenceType.name}
                                    type="checkbox"
                                    checked={isActive}
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
            {availableTypeIds.length > 1 && (
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
            )}
        </div>
    );
}

MapFilter.propTypes = {
    mapReferenceTypes: PropTypes.array,
    locationCountByReferenceType: PropTypes.object,
    filter: PropTypes.array,
    toggleMapFilter: PropTypes.func.isRequired,
};
