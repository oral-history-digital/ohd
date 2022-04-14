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

    // Get facets
    const facetKeys = [];
    for (let key of searchParams.keys()) {
        if (key.endsWith('[]')) {
            facetKeys.push(key.slice(0, -2));
        }
    }
    const uniqueFacetKeys = [...new Set(facetKeys)];

    const facets = {};
    uniqueFacetKeys.forEach(key => {
        facets[key] = searchParams.getAll(`${key}[]`);
    });


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
        sortAndPush();
    }

    function addFacetParam(name, value) {
        const previousValues = searchParams.getAll(name);
        if (previousValues.includes(value)) {
            return;
        }

        searchParams.append(name, value);

        sortAndPush();
    }

    function deleteFacetParam(name, value) {
        const previousValues = searchParams.getAll(name);
        searchParams.delete(name);

        const newValues = previousValues.filter(v => v !== value);
        newValues.forEach(v => {
            searchParams.append(name, v);
        });

        sortAndPush();
    }

    function getFacetParam(name) {
        return searchParams.getAll(`${name}[]`);
    }

    function sortAndPush() {
        searchParams.sort();
        history.push({
            search: searchParams.toString(),
        });
    }

    return {
        searchParams,
        sortBy,
        sortOrder,
        fulltext,
        facets,
        setSortBy,
        setSortOrder,
        setFulltext,
        setParam,
        addFacetParam,
        deleteFacetParam,
        getFacetParam,
    };
}
