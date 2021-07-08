import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import LocationsContainer from './LocationsContainer'
import MapPopupContent from './MapPopupContent';

export default function InterviewLocations({
    locationsFetched,
    currentLocations,
    loading,
    error,
    archiveId,
    fetchLocations,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();

    useEffect(() => {
        if (locationsFetched) {
            return;
        }

        fetchLocations(pathBase, archiveId);
    }, []);

    if (!currentLocations || currentLocations.length === 0) {
        return null;
    }

    return (
        <div>
            <div className='explanation'>
                {t('interview_map_explanation')}
            </div>
            <LocationsContainer
                data={currentLocations}
                loaded={locationsFetched}
                popupContent={location => <MapPopupContent location={location} />}
            />
        </div>
    );
}

InterviewLocations.propTypes = {
    locationsFetched: PropTypes.bool.isRequired,
    currentLocations: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    archiveId: PropTypes.string.isRequired,
    fetchLocations: PropTypes.func.isRequired,
};
