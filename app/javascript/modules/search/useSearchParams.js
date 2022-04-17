import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

const qsOptions = {
    arrayFormat: 'bracket',
}

export default function useSearchParams() {
    const { search } = useLocation();
    const history = useHistory();

    const params = useMemo(
        () => queryString.parse(search, qsOptions), [search]
    );

    const sortBy = params.sort;
    const sortOrder = params.order;
    const fulltext = params.fulltext;
    const yearMin = params.year_min
    const yearMax = params.year_max;

    const facets = {
        ...params,
    };
    delete facets.sort;
    delete facets.order;
    delete facets.fulltext;
    delete facets.year_min;
    delete facets.year_max;


    function setSortBy(value) {
        setParam('sort', value);
    }

    function setSortOrder(value) {
        setParam('order', value);
    }

    function setFulltext(value) {
        setParam('fulltext', value);
    }

    function setYearMinMax(min, max) {
        setParams({
            year_min: min,
            year_max: max,
        });
    }

    function setParam(name, value) {
        const newParams = {
            ...params,
           [name]: value,
        };
        pushToHistory(newParams);
    }

    function setParams(object) {
        const newParams = {
            ...params,
            ...object,
        };
        pushToHistory(newParams);
    }

    function deleteParam(name) {
        const newParams = {
            ...params,
        };
        delete newParams[name];

        pushToHistory(newParams);
    }

    function addFacetParam(name, value) {
        const newParams = {
            ...params,
        };

        const previousValues = newParams[name];

        if (!previousValues) {
            newParams[name] = [value];
        } else {
            if (previousValues.includes(value)) {
                return;
            } else {
                newParams[name] = newParams[name].concat(value);
            }
        }

        pushToHistory(newParams);
    }

    function deleteFacetParam(name, value) {
        const newParams = {
            ...params,
        };

        const previousValues = newParams[name];
        if (!previousValues) {
            // No need to delete.
            return;
        }

        if (!previousValues.includes(value)) {
            // No need to delete.
            return;
        }

        const valueIndex = previousValues.indexOf(value);
        const firstPart = previousValues.slice(0, valueIndex);
        const lastPart = previousValues.slice(valueIndex + 1);
        const newValues = firstPart.concat(lastPart);

        newParams[name] = newValues;

        pushToHistory(newParams);
    }

    function getFacetParam(name) {
        return params[name] || [];
    }

    function resetSearchParams() {
        // Just keep sort criterion and order.
        const newParams = {
            sort: params.sort,
            order: params.order,
        };

        pushToHistory(newParams);
    }

    function pushToHistory(newParams) {
        console.log(queryString.stringify(newParams, qsOptions));

        history.push({
            search: queryString.stringify(newParams, qsOptions),
        });
    }

    return {
        sortBy,
        sortOrder,
        yearMin,
        yearMax,
        fulltext,
        facets,
        setSortBy,
        setSortOrder,
        setFulltext,
        setYearMinMax,
        setParam,
        addFacetParam,
        deleteFacetParam,
        getFacetParam,
        resetSearchParams,
    };
}
