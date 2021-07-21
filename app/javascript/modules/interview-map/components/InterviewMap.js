import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { MapComponent } from 'modules/map';
import { getArchiveId } from 'modules/archive';
import useInterviewMap from '../useInterviewMap';
import InterviewMapPopup from './InterviewMapPopup';

export default function InterviewMap() {
    const { t } = useI18n();
    const archiveId = useSelector(getArchiveId);
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
                        className="Map--interview"
                        loading={isLoading}
                        markers={markers}
                        popupComponent={InterviewMapPopup}
                    />
                )
            }
        </>
    );
}
