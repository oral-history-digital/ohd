import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { getIsLoggedIn } from 'modules/user';
import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';

export default function useFeaturedInterviews() {
    const isLoggedIn = useSelector(getIsLoggedIn);
    const pathBase = usePathBase();

    // The query-string part of the path is not used in the backend, SWR just needs two different
    // strings to differentiate between the two calls. Maybe this is temporary.
    const path = `${pathBase}/random_featured_interviews.json?logged-in=${isLoggedIn}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    const interviews = data ? Object.values(data.data) : null;

    return {
        isValidating,
        interviews,
        error,
    };
}
