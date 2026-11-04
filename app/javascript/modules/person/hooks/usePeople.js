import { fetcher } from 'modules/api';
import { usePathBase, useProject } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

/**
 * Loads the current project's people after its display data is available in Redux.
 * Retained people are hidden while project settings are unavailable.
 *
 * @returns {Object} People by ID, loading/refresh status, and project or people errors.
 */
export default function usePeople() {
    const {
        project,
        isLoading: projectIsLoading,
        isValidating: projectIsValidating,
        error: projectError,
    } = useProject();
    const pathBase = usePathBase();
    const canFetch = !!project?.id && !projectIsLoading && !projectError;

    const path = canFetch
        ? `${pathBase}/people.json?for_projects=${project.id}`
        : null;

    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    return {
        isLoading: projectIsLoading || (canFetch && isLoading),
        isValidating: projectIsValidating || (canFetch && isValidating),
        data: canFetch ? data?.data : undefined,
        error: projectError || (canFetch ? error : undefined),
    };
}
