import PropTypes from 'prop-types';
import useSWR from 'swr';

import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { MapComponent } from 'modules/map';
import fetcher from '../fetcher';
import transformLocations from '../transformLocations';

export default function InterviewLocations({
    archiveId,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();

    const { data, error } = useSWR(`${pathBase}/locations.json?archive_id=${archiveId}`, fetcher, {
        revalidateOnFocus: false,
    });

    console.log('rendering');
    const markers = transformLocations(data || []);

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
                        loading={!data}
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
