import { useMemo } from 'react';

import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useTranscriptQueryString() {
    const { search } = useLocation();
    const navigate = useNavigate();

    const params = useMemo(() => queryString.parse(search), [search]);

    const segment = Number.parseInt(params.segment);

    function setSegment(id) {
        setParam('segment', id);
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
            segment,
            setSegment,
            setParam,
            resetSearchParams,
        };
    }, [search]);

    return memoizedValue;
}
