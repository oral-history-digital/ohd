import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { MapComponent } from 'modules/map';

export default function InterviewLocations({
    markers,
    loading,
    error,
    archiveId,
    fetchLocations,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();

    useEffect(() => {
        fetchLocations(pathBase, archiveId);
    }, [fetchLocations, pathBase, archiveId]);

    return (
        <>
            <div className="explanation">
                {t('modules.interview_map.description')}
            </div>
            {
                error ? (
                    <div className="explanation">
                        {t('modules.interview_map.error')}: {error}
                    </div>
                ) : (
                    <MapComponent
                        loading={loading}
                        markers={markers || []}
                    />
                )
            }
        </>
    );
}

InterviewLocations.propTypes = {
    markers: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    archiveId: PropTypes.string.isRequired,
    fetchLocations: PropTypes.func.isRequired,
};
