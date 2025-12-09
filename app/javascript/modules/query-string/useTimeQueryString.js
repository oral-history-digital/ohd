import { useMemo } from 'react';

import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

export default function useTimeQueryString() {
    const { search } = useLocation();

    const memoizedValue = useMemo(() => {
        const params = queryString.parse(search);
        const tape = Number.parseInt(params.tape);
        const time = params.time;

        return {
            tape,
            time,
        };
    }, [search]);

    return memoizedValue;
}
