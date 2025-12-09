import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

export default function useSearchSuggestions() {
    const pathBase = usePathBase();

    const path = `${pathBase}/searches/suggestions`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    return {
        isValidating,
        allInterviewsPseudonyms: data?.all_interviews_pseudonyms,
        allInterviewsTitles: data?.all_interviews_titles,
        sortedArchiveIds: data?.sorted_archive_ids,
        error,
    };
}
