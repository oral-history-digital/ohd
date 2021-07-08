import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { MapComponent } from 'modules/map';

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

    console.log(currentLocations);

    const markers = currentLocations.map(location => ({
        id: location.id,
        lat: location.latitude,
        long: location.longitude,
        radius: 7.5,
        color: 'red',
    }));

    return (
        <div>
            <div className="explanation">
                {t('interview_map_explanation')}
            </div>
            <MapComponent
                loading={loading}
                markers={markers}
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
