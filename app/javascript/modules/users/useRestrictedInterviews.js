import { useSelector } from 'react-redux';
import useSWR from 'swr';

import { getIsLoggedIn } from 'modules/user';
import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useRestrictedInterviews() {
    const isLoggedIn = useSelector(getIsLoggedIn);
    const pathBase = usePathBase();

    // The query-string part of the path is not used in the backend, SWR just needs two different
    // strings to differentiate between the two calls. Maybe this is temporary.
    const path = `${pathBase}/restricted_interviews.json?logged-in=${isLoggedIn}`;

    const { isValidating, data, error } = useSWR(path, fetcher);
    const interviews = data ? Object.values(data.data) : null;

    return {
        isValidating,
        interviews,
        error,
    };
}
