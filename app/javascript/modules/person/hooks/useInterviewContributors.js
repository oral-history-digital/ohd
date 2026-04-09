import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

/**
 * Fetch all people who contributed to a specific interview (interviewees, interviewers, etc.).
 *
 * Uses SWR immutable caching since interview contributors rarely change during a session.
 * Data is cached globally by interview ID, so multiple components can call this hook
 * without triggering redundant API requests.
 *
 * To manually refresh data after contributor updates, use SWR's mutate function:
 * `mutate(pathBase + '/people.json?contributors_for_interview=' + interviewId)`
 *
 * @param {number|string|null} interviewId - The interview ID to fetch contributors for
 * @returns {Object} SWR response with:
 *   - data: Object mapping contributor IDs to person objects
 *   - isLoading: boolean indicating if initial fetch is in progress
 *   - isValidating: boolean indicating if revalidation is in progress
 *   - error: Error object if request failed
 */
export default function useInterviewContributors(interviewId) {
    const pathBase = usePathBase();

    const path = interviewId
        ? `${pathBase}/people.json?contributors_for_interview=${interviewId}`
        : null;

    // Use useSWRImmutable since contributors rarely change during a session.
    // This prevents unnecessary revalidation while still allowing manual updates via mutate().
    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    return { isLoading, isValidating, data: data?.data, error };
}
