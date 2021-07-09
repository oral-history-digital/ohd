import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { MapComponent } from 'modules/map';
import useInterviewMap from '../useInterviewMap';

export default function InterviewLocations({
    archiveId,
}) {
    const { t } = useI18n();
    const { isLoading, markers, error } = useInterviewMap(archiveId);

    return (
        <>
            <div className="explanation">
                {t('modules.interview_map.description')}
            </div>
            {
                error ? (
                    <div className="explanation">
                        {t('modules.interview_map.error')}: {error.message}
                    </div>
                ) : (
                    <MapComponent
                        loading={isLoading}
                        markers={markers}
                    />
                )
            }
        </>
    );
}

InterviewLocations.propTypes = {
    archiveId: PropTypes.string.isRequired,
};
