import { useMemo } from 'react';

import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useTimeQueryString() {
    const { search } = useLocation();
    const navigate = useNavigate();

    const params = useMemo(() => queryString.parse(search), [search]);

    const tape = Number.parseInt(params.tape);
    const time = params.time;

    function setTape(tape) {
        setParam('tape', tape);
    }

    function setTime(time) {
        setParam('time', time);
    }

    function setParam(name, value) {
        const newParams = {
            ...params,
            [name]: value,
        };
        pushToHistory(newParams);
    }

    function resetSearchParams() {
        const newParams = {};
        pushToHistory(newParams);
    }

    function pushToHistory(newParams, replace = false) {
        const options = {
            search: queryString.stringify(newParams),
        };

        navigate(options, { replace });
    }

    const memoizedValue = useMemo(() => {
        return {
            allParams: params,
            tape,
            time,
            setTape,
            setTime,
            setParam,
            resetSearchParams,
        };
    }, [search]);

    return memoizedValue;
}
