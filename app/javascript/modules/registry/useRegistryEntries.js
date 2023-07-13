import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getRegistryEntries, getRegistryEntriesStatus, fetchData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function useRegistryEntries(registryEntryParent) {
    const { project, projectId } = useProject();
    const { locale } = useI18n();
    const registryEntries = useSelector(getRegistryEntries);
    const registryEntriesStatus = useSelector(getRegistryEntriesStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        loadWithAssociations();
        loadRegistryEntries();
    });

    function loadWithAssociations() {
        if (
            registryEntryParent &&
            !registryEntryParent.associations_loaded &&
            registryEntriesStatus[registryEntryParent.id] !== 'fetching'
        ) {
            dispatch(fetchData({ locale, project, projectId }, 'registry_entries',
                registryEntryParent.id, null, 'with_associations=true'));
        }
    }

    function loadRegistryEntries() {
        if (
            projectId &&
            registryEntryParent &&
            registryEntryParent.associations_loaded &&
            !registryEntriesStatus[`children_for_entry_${registryEntryParent.id}`]
        ) {
            dispatch(fetchData({ locale, project, projectId }, 'registry_entries',
                null, null, `children_for_entry=${registryEntryParent.id}`));
        }
    }

    function dataLoaded() {
        return (
            registryEntryParent &&
            registryEntriesStatus[`children_for_entry_${registryEntryParent.id}`] &&
            registryEntriesStatus[`children_for_entry_${registryEntryParent.id}`].split('-')[0] === 'fetched' &&
            registryEntryParent.associations_loaded
        );
    }

    return {
        dataLoaded: dataLoaded(),
        registryEntries,
    }
}
