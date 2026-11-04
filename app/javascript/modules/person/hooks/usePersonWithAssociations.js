import { fetcher } from 'modules/api';
import { useProjectAccessStatus } from 'modules/auth';
import { usePathBase, useProject } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

/**
 * Loads full person data for project access holders, otherwise landing-page metadata.
 * Waits for Redux project settings and hides cached person data while they are unavailable.
 *
 * @param {number|null|undefined} id - Person ID; nonnumeric values skip fetching.
 * @returns {Object} Person data, loading/refresh status, and project or person request errors.
 */
export default function usePersonWithAssociations(id) {
    const {
        project,
        isLoading: projectIsLoading,
        isValidating: projectIsValidating,
        error: projectError,
    } = useProject();
    const pathBase = usePathBase();
    const { projectAccessGranted } = useProjectAccessStatus(project);

    const path = projectAccessGranted
        ? `${pathBase}/people/${id}.json?with_associations=true`
        : `${pathBase}/people/${id}/landing_page_metadata.json`;

    const canFetch = Boolean(project) && typeof id === 'number';
    const { isLoading, isValidating, data, error } = useSWRImmutable(
        canFetch ? path : null,
        fetcher,
        { keepPreviousData: false }
    );

    return {
        isLoading: projectIsLoading || (canFetch && isLoading),
        isValidating: projectIsValidating || (canFetch && isValidating),
        data: canFetch ? data?.data : undefined,
        error: projectError || (canFetch ? error : undefined),
    };
}
