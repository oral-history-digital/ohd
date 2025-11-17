import useSWR from 'swr';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useInterviewContributors(interviewId) {
    const pathBase = usePathBase();

    const path = interviewId
        ? `${pathBase}/people.json?contributors_for_interview=${interviewId}`
        : null;

    const { isLoading, isValidating, data, error } = useSWR(path, fetcher, {
        // Don't revalidate automatically, but allow manual revalidation
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return { isLoading, isValidating, data: data?.data, error };
}
