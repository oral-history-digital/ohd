import { fetcher } from 'modules/api';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

/**
 * Loads the people who contributed to an interview, using the current route or its owning project.
 * Contributor responses share the existing immutable SWR cache; failed reads hide retained people.
 *
 * @param {number|string|null|undefined} interviewId - Internal interview ID; empty skips fetching.
 * @param {{shortname: string}} [project] - Loaded project for reads outside the current route.
 * @returns {Object} Contributors by person ID, loading/refresh status, and request error.
 */
export default function useInterviewContributors(interviewId, project) {
    const currentPathBase = usePathBase();
    const { locale } = useI18n();
    // Select the owning project on this host, retaining the current session.
    const pathBase = project
        ? `/${project.shortname}/${locale}`
        : currentPathBase;

    const path = interviewId
        ? `${pathBase}/people.json?contributors_for_interview=${interviewId}`
        : null;

    // Use useSWRImmutable since contributors rarely change during a session.
    // This prevents unnecessary revalidation while still allowing manual updates via mutate().
    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    return {
        isLoading,
        isValidating,
        data: error ? undefined : data?.data,
        error,
    };
}
