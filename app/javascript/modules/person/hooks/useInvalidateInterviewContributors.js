import { usePathBase } from 'modules/routes';
import { useSWRConfig } from 'swr';

export default function useInvalidateInterviewContributors(interviewId) {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return async function invalidateInterviewContributors() {
        const path = interviewId
            ? `${pathBase}/people.json?contributors_for_interview=${interviewId}`
            : null;

        if (path) {
            // Don't clear the data (undefined), just revalidate
            // This prevents the component from seeing undefined data during refetch
            await mutate(path);
        }
    };
}
