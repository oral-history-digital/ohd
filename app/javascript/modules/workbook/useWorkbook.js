import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export default function useWorkbook() {
    const pathBase = usePathBase();

    const path = `${pathBase}/user_contents`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    // Is it important to check for this:
    // if (user.email && !user.error) -> fetch

    let savedInterviews, savedSearches, savedSegments;
    if (data) {
        const sortedData = Object.values(data.data).sort((a, b) => {
            const aDate = new Date(a.created_at);
            const bDate = new Date(b.created_at);
            return bDate - aDate;
        });

        savedSearches = sortedData.filter((ref) => ref.type === 'Search');
        savedInterviews = sortedData.filter(
            (ref) => ref.type === 'InterviewReference'
        );
        savedSegments = sortedData.filter(
            (ref) => ref.type === 'UserAnnotation'
        );
    }

    return {
        loaded: typeof data === 'object',
        isValidating,
        savedSearches,
        savedInterviews,
        savedSegments,
        error,
    };
}
