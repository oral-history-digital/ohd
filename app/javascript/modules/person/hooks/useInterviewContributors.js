import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useInterviewContributors(interviewId) {
    const pathBase = usePathBase();

    const path = interviewId
        ? `${pathBase}/people.json?contributors_for_interview=${interviewId}`
        : null;

    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    return { isLoading, isValidating, data: data?.data, error };
}
