import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAuthorization } from 'modules/auth';
import { getRegistryEntries, getRegistryEntriesStatus, fetchData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';

export default function useRegistryEntries(registryEntryParent) {
    const { project, projectId } = useProject();
    const { t, locale } = useI18n();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const registryEntries = useSelector(getRegistryEntries);
    const registryEntriesStatus = useSelector(getRegistryEntriesStatus);
    const { isAuthorized } = useAuthorization();

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

    function sortedRegistryEntries() {
        if (!registryEntryParent?.child_ids || !registryEntries) {
            return [];
        }

        return registryEntryParent.child_ids[locale]
            .map((id) => registryEntries[id])
            .filter((registryEntry) => typeof registryEntry !== 'undefined'
                && !isHidden(registryEntry))
            .sort(registryEntryComparator);
    }

    function registryEntryComparator(entryA, entryB) {
        const nameEntryA = registryEntryName(entryA);
        const nameEntryB = registryEntryName(entryB);
        return nameEntryA.localeCompare(nameEntryB);
    }

    function registryEntryName(registryEntry) {
        const localizedName = registryEntry.name[locale];
        const name = localizedName?.length > 0
            ? localizedName
            : String(registryEntry.id);
        return name;
    }

    function isHidden(aRegistryEntry) {
        if (hasAdminRights()) {
            return false;
        }

        return isAlwaysHidden(aRegistryEntry)
            || (isLoggedOut() && isHiddenWhenLoggedOut(aRegistryEntry));
    }

    function hasAdminRights() {
        return isAuthorized({ type: 'RegistryEntry' }, 'update');
    }

    function isAlwaysHidden(aRegistryEntry) {
        return project.hidden_registry_entry_ids?.includes(String(aRegistryEntry.id));
    }

    function isLoggedOut() {
        return !isLoggedIn;
    }

    function isHiddenWhenLoggedOut(aRegistryEntry) {
        return !isMarkedVisibleWhenLoggedOut(aRegistryEntry)
            && isOnFirstLevel(aRegistryEntry);
    }

    function isMarkedVisibleWhenLoggedOut(aRegistryEntry) {
        return project.logged_out_visible_registry_entry_ids?.includes(String(aRegistryEntry.id));
    }

    function isOnFirstLevel(aRegistryEntry) {
        return !!(aRegistryEntry.parent_registry_hierarchy_ids[project.root_registry_entry_id]);
    }

    return {
        dataLoaded: dataLoaded(),
        registryEntries: sortedRegistryEntries(),
    }
}
