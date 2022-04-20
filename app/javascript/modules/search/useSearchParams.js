import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

const qsOptions = {
    arrayFormat: 'bracket',
};

export default function useSearchParams() {
    const { search } = useLocation();
    const history = useHistory();

    const params = useMemo(
        () => queryString.parse(search, qsOptions), [search]
    );

    const sortBy = params.sort;
    const sortOrder = params.order;
    const fulltext = params.fulltext;
    const yearOfBirthMin = Number.parseInt(params.year_of_birth_min);
    const yearOfBirthMax = Number.parseInt(params.year_of_birth_max);

    const facets = {
        ...params,
    };
    delete facets.sort;
    delete facets.order;
    delete facets.fulltext;
    delete facets.year_of_birth_min;
    delete facets.year_of_birth_max;


    function setSortBy(value) {
        setParam('sort', value);
    }

    function setSortOrder(value) {
        setParam('order', value);
    }

    function setSort(criterion, order) {
        const newParams = {
            ...params,
           sort: criterion,
           order,
        };
        pushToHistory(newParams);
    }

    function setFulltext(value) {
        setParam('fulltext', value);
    }

    function setYearOfBirthRange(min, max) {
        setParams({
            year_of_birth_min: min,
            year_of_birth_max: max,
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
        history.push({
            search: queryString.stringify(newParams, qsOptions),
        });
    }

    const memoizedValue = useMemo(() => {
        return {
            allParams: params,
            sortBy,
            sortOrder,
            yearOfBirthMin,
            yearOfBirthMax,
            fulltext,
            facets,
            setSortBy,
            setSortOrder,
            setSort,
            setFulltext,
            setYearOfBirthRange,
            setParam,
            addFacetParam,
            deleteFacetParam,
            getFacetParam,
            resetSearchParams,
        };
    }, [search]);

    return memoizedValue;
}
