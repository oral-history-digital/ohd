import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function useSearchParams() {
    const { search } = useLocation();
    const history = useHistory();

    console.log('search: ' + search)

    const searchParams = useMemo(() => new URLSearchParams(search), [search]);

    const sortBy = searchParams.get('sort');
    const sortOrder = searchParams.get('order');
    const fulltext = searchParams.get('fulltext');

    function setSortBy(value) {
        setParam('sort', value);
    }

    function setSortOrder(value) {
        setParam('order', value);
    }

    function setFulltext(value) {
        setParam('fulltext', value);
    }

    function setParam(name, value) {
        searchParams.set(name, value);
        history.push({
            search: searchParams.toString(),
        });
    }

    return {
        searchParams,
        sortBy,
        sortOrder,
        fulltext,
        setSortBy,
        setSortOrder,
        setFulltext,
    };
}
