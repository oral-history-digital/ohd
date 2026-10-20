import { usePathBase, useProject } from 'modules/routes';
import { useSWRConfig } from 'swr';

/**
 * Refreshes or updates the same project-scoped cache used by usePeople.
 *
 * @returns {function(Function=): void} Cache updater; skips changes while project settings are unavailable.
 */
export default function useMutatePeople() {
    const { project, isLoading, error } = useProject({});
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    /**
     * Updates cached people, or revalidates the list when no updater is provided.
     *
     * @param {Function} [updateDocument] - Updates the cached response without revalidation.
     */
    return function mutatePeople(updateDocument) {
        if (!project?.id || isLoading || error) return;
        const path = `${pathBase}/people.json?for_projects=${project.id}`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    };
}
