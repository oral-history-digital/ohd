import { useEffect } from 'react';

import {
    fetchData,
    getRegistryEntries,
    getRegistryEntriesStatus,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

export default function useRootEntry() {
    const { project, projectId } = useProject();
    const { locale } = useI18n();
    const dispatch = useDispatch();
    const registryEntries = useSelector(getRegistryEntries);
    const registryEntriesStatus = useSelector(getRegistryEntriesStatus);

    useEffect(() => {
        if (hasNotBeenLoaded() && isNotLoading()) {
            load();
        }
    }, [registryEntriesStatus[project.root_registry_entry_id]]);

    function hasNotBeenLoaded() {
        const fetched = /^fetched/;
        return !fetched.test(
            registryEntriesStatus[project.root_registry_entry_id]
        );
    }

    function isNotLoading() {
        const fetching = /^fetching/;
        return !fetching.test(
            registryEntriesStatus[project.root_registry_entry_id]
        );
    }

    function load() {
        dispatch(
            fetchData(
                { locale, project, projectId },
                'registry_entries',
                project.root_registry_entry_id,
                null,
                'with_associations=true'
            )
        );
    }

    return {
        isLoading: hasNotBeenLoaded(),
        data: registryEntries[project.root_registry_entry_id],
    };
}
