import { useEffect } from 'react';

import {
    fetchData,
    getRegistryEntries,
    getRegistryEntriesStatus,
} from 'modules/data';
import { usePathBase, useProject } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Loads the configured registry root after Redux project settings are available.
 * Reuses registry entry status to skip pending/completed loads and honor reload requests.
 *
 * @returns {{isLoading: boolean, data: Object|undefined, error: Object|null}} Root loading state,
 * cached entry, and project request error. A missing root returns no entry without fetching.
 */
export default function useRootEntry() {
    const {
        project,
        isLoading: projectIsLoading,
        error,
    } = useProject({
        include: ['registry_configuration'],
    });
    const pathBase = usePathBase();
    const dispatch = useDispatch();
    const registryEntries = useSelector(getRegistryEntries);
    const registryEntriesStatus = useSelector(getRegistryEntriesStatus);
    const rootId = project?.root_registry_entry_id;
    const status = rootId ? registryEntriesStatus[rootId] : undefined;
    const fetched = /^fetched/.test(status);

    useEffect(() => {
        if (rootId && !error && !fetched && !/^fetching/.test(status)) {
            dispatch(
                fetchData(
                    { pathBase },
                    'registry_entries',
                    rootId,
                    null,
                    'with_associations=true'
                )
            );
        }
    }, [dispatch, pathBase, rootId, status, fetched, error]);

    return {
        isLoading: projectIsLoading || Boolean(rootId && !fetched && !error),
        data: rootId && !error ? registryEntries[rootId] : undefined,
        error: error || null,
    };
}
