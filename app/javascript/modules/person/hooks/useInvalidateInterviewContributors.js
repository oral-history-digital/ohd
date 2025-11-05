import { useSWRConfig } from 'swr';

import { usePathBase } from 'modules/routes';

export default function useInvalidateInterviewContributors(interviewId) {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function invalidateInterviewContributors() {
        const path = interviewId
            ? `${pathBase}/people.json?contributors_for_interview=${interviewId}`
            : null;

        if (path) {
            mutate(path, undefined, { revalidate: true });
        }
    };
}
