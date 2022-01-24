import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { fetcher } from 'modules/api';
import { getCurrentProject } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { MARKER_COLOR_SEGMENT_TYPE } from '../constants';

export default function useMapReferenceTypes() {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);

    const path = `${pathBase}/searches/map_reference_types`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    // TODO: Another place?
    let combinedTypes;

    if (data) {
        combinedTypes = data.concat({
            id: 'S',
            name: t('modules.map.mentions'),
            color: project.secondary_color || MARKER_COLOR_SEGMENT_TYPE,
        })
    }

    return { isValidating, referenceTypes: combinedTypes, error };
}
