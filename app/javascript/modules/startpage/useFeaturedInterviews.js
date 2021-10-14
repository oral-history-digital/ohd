import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useFeaturedInterviews() {
    const pathBase = usePathBase();

    const path = `${pathBase}/random_featured_interviews`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    const interviews = data ? Object.values(data.data) : null;

    return {
        isValidating,
        interviews,
        error,
    };
}
