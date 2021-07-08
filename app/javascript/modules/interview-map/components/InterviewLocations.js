import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { MapComponent } from 'modules/map';
import fetchInterviewMap from '../fetchInterviewMap';

export default function InterviewLocations({
    archiveId,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();

    const { isLoading, data, error } = useQuery(
        ['interview-map', archiveId],
        () => fetchInterviewMap(pathBase, archiveId),
        {
            staleTime: 10*60*1000,
            cacheTime: 60*60*1000,
        }
    );

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
                        markers={data || []}
                    />
                )
            }
        </>
    );
}

InterviewLocations.propTypes = {
    archiveId: PropTypes.string.isRequired,
};
