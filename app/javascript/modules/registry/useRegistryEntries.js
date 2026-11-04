import { useEffect } from 'react';

import { useAuthorization } from 'modules/auth';
import {
    fetchData,
    getRegistryEntries,
    getRegistryEntriesStatus,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Loads and sorts registry children using Redux project visibility configuration.
 * Preserves hidden-entry rules, visitor visibility at the root, and update-permission overrides.
 *
 * @param {Object|undefined} registryEntryParent - Parent whose children are displayed.
 * @returns {{dataLoaded: boolean, registryEntries: Object[], error: Object|null}} Visible children,
 * readiness state, and project request error. No children are exposed before configuration loads.
 */
export default function useRegistryEntries(registryEntryParent) {
    const { project, error } = useProject({
        include: ['registry_configuration'],
    });
    const pathBase = usePathBase();
    const { locale } = useI18n();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const registryEntries = useSelector(getRegistryEntries);
    const registryEntriesStatus = useSelector(getRegistryEntriesStatus);
    const { isAuthorized } = useAuthorization();

    const dispatch = useDispatch();

    const parentId = registryEntryParent?.id;
    const parentHasAssociations = registryEntryParent?.associations_loaded;
    const parentStatus = registryEntriesStatus[parentId];
    const childrenStatus =
        registryEntriesStatus[`children_for_entry_${parentId}`];
    const canLoad = Boolean(project && !error && parentId);
    const dataLoaded = Boolean(
        canLoad &&
            parentHasAssociations &&
            childrenStatus?.split('-')[0] === 'fetched'
    );

    useEffect(() => {
        if (!canLoad) return;

        if (!parentHasAssociations && parentStatus !== 'fetching') {
            dispatch(
                fetchData(
                    { pathBase },
                    'registry_entries',
                    parentId,
                    null,
                    'with_associations=true'
                )
            );
        }
        if (parentHasAssociations && !childrenStatus) {
            dispatch(
                fetchData(
                    { pathBase },
                    'registry_entries',
                    null,
                    null,
                    `children_for_entry=${parentId}`
                )
            );
        }
    }, [
        dispatch,
        pathBase,
        parentId,
        parentHasAssociations,
        parentStatus,
        childrenStatus,
        canLoad,
    ]);

    /** @returns {Object[]} Children visible to the current user, sorted by localized name. */
    function sortedRegistryEntries() {
        if (!registryEntryParent?.child_ids || !registryEntries) {
            return [];
        }

        return (registryEntryParent.child_ids[locale] || [])
            .map((id) => registryEntries[id])
            .filter(
                (registryEntry) =>
                    typeof registryEntry !== 'undefined' &&
                    !isHidden(registryEntry)
            )
            .sort(registryEntryComparator);
    }

    function registryEntryComparator(entryA, entryB) {
        const nameEntryA = registryEntryName(entryA);
        const nameEntryB = registryEntryName(entryB);
        return nameEntryA.localeCompare(nameEntryB);
    }

    function registryEntryName(registryEntry) {
        const localizedName = registryEntry.name[locale];
        const name =
            localizedName?.length > 0
                ? localizedName
                : String(registryEntry.id);
        return name;
    }

    function isHidden(aRegistryEntry) {
        if (hasAdminRights()) {
            return false;
        }

        return (
            isAlwaysHidden(aRegistryEntry) ||
            (isLoggedOut() && isHiddenWhenLoggedOut(aRegistryEntry))
        );
    }

    function hasAdminRights() {
        return isAuthorized({ type: 'RegistryEntry' }, 'update');
    }

    function isAlwaysHidden(aRegistryEntry) {
        return project.hidden_registry_entry_ids?.includes(
            String(aRegistryEntry.id)
        );
    }

    function isLoggedOut() {
        return !isLoggedIn;
    }

    function isHiddenWhenLoggedOut(aRegistryEntry) {
        return (
            !isMarkedVisibleWhenLoggedOut(aRegistryEntry) &&
            isOnFirstLevel(aRegistryEntry)
        );
    }

    function isMarkedVisibleWhenLoggedOut(aRegistryEntry) {
        return project.logged_out_visible_registry_entry_ids?.includes(
            String(aRegistryEntry.id)
        );
    }

    function isOnFirstLevel(aRegistryEntry) {
        return !!aRegistryEntry.parent_registry_hierarchy_ids[
            project.root_registry_entry_id
        ];
    }

    return {
        dataLoaded,
        registryEntries: canLoad ? sortedRegistryEntries() : [],
        error: error || null,
    };
}
