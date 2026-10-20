import { fetcher } from 'modules/api';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

import { MARKER_COLOR_SEGMENT_TYPE } from '../constants';

/**
 * Loads map reference types and adds segment mentions using the project color.
 *
 * @returns {Object} Reference types, refresh status, and project or reference-type errors.
 */
export default function useMapReferenceTypes() {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const {
        project,
        isLoading,
        isValidating: projectIsValidating,
        error: projectError,
    } = useProject({});

    const path = `${pathBase}/searches/map_reference_types`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    let combinedTypes;

    if (project && !isLoading && !projectError && data && !error) {
        combinedTypes = data.concat({
            id: 'segment',
            name: t('modules.map.mentions'),
            color: project.secondary_color || MARKER_COLOR_SEGMENT_TYPE,
        });
    }

    return {
        isValidating: projectIsValidating || isValidating,
        referenceTypes: combinedTypes,
        error: projectError || error,
    };
}
