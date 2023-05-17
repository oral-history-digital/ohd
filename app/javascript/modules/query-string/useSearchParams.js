import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const qsOptions = {
    arrayFormat: 'bracket',
};

export default function useSearchParams() {
    const location = useLocation();
    const navigate = useNavigate();
    const { search, pathname } = location;

    const params = useMemo(
        () => queryString.parse(search, qsOptions), [search]
    );

    const sortBy = params.sort;
    const sortOrder = params.order;
    const fulltext = params.fulltext;
    const fulltextIsSet = fulltext?.length > 0;
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

    function setSort(sort, order) {
        const newParams = {
            ...params,
           sort,
           order,
        };
        pushToHistory(newParams);
    }

    function setDefaultSortOptions(sort, order) {
        const newParams = {
            ...params,
           sort,
           order,
        };
        pushToHistory(newParams, true);
    }

    function setFulltext(value) {
        setParam('fulltext', value);
    }

    function setFulltextAndSort(fulltext, sort, order) {
        const newParams = {
            ...params,
           fulltext,
           sort,
           order,
        };
        pushToHistory(newParams);
    }

    function setYearOfBirthRange(min, max) {
        setParams({
            year_of_birth_min: min,
            year_of_birth_max: max,
        });
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

    function setRangeParam(name, range) {
        setParam(name, `${range[0]}-${range[1]}`);
    }

    function deleteRangeParam(name) {
        deleteParam(name);
    }

    function getRangeParam(name) {
        const value = params[name];
        if (!value) {
            return undefined;
        }

        const range = value.split('-')
            .map(year => Number(year));
        return range;
    }

    function resetSearchParams() {
        const newParams = {};
        pushToHistory(newParams);
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

    function pushToHistory(newParams, replace = false) {
        const qs = queryString.stringify(newParams, qsOptions);

        // Use location object from window instead of useLocation because
        // the useLocation object does not return the correct pathname.
        // Maybe upgrade to the new React Router API (createBrowserRouter).
        const all = `${window.location.pathname}?${qs}`;

        navigate(all, { replace });
    }

    const memoizedValue = useMemo(() => {
        return {
            allParams: params,
            sortBy,
            sortOrder,
            yearOfBirthMin,
            yearOfBirthMax,
            fulltext,
            fulltextIsSet,
            facets,
            setSortBy,
            setSortOrder,
            setSort,
            setDefaultSortOptions,
            setFulltext,
            setFulltextAndSort,
            setYearOfBirthRange,
            setRangeParam,
            getRangeParam,
            deleteRangeParam,
            setParam,
            addFacetParam,
            deleteFacetParam,
            getFacetParam,
            resetSearchParams,
        };
    }, [search]);

    return memoizedValue;
}
