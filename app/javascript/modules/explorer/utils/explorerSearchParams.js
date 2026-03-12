export const FILTER_PARAMS = [
    'explorer_q',
    'explorer_interviews_min',
    'explorer_interviews_max',
    'explorer_collections_min',
    'explorer_collections_max',
    'explorer_inst_archives_min',
    'explorer_inst_archives_max',
    'explorer_year_min',
    'explorer_year_max',
    'explorer_institution',
    'explorer_sort',
    'explorer_inst_sort',
];

export const resetExplorerFilters = (prev) => {
    FILTER_PARAMS.forEach((key) => prev.delete(key));
    return prev;
};

/**
 * Sets or removes the `explorer_q` search param.
 *
 * @param {URLSearchParams} prev
 * @param {string} value
 * @returns {URLSearchParams}
 */
export const applyQueryParam = (prev, value) => {
    if (value) {
        prev.set('explorer_q', value);
    } else {
        prev.delete('explorer_q');
    }
    return prev;
};

/**
 * Sets or removes `explorer_interviews_min` / `explorer_interviews_max`
 * search params. Values equal to the global bounds are removed (clean URL).
 *
 * @param {URLSearchParams} prev
 * @param {number} min
 * @param {number} max
 * @param {number} globalMin
 * @param {number} globalMax
 * @returns {URLSearchParams}
 */
export const applyInterviewRangeParams = (
    prev,
    min,
    max,
    globalMin,
    globalMax
) => {
    if (min === globalMin) {
        prev.delete('explorer_interviews_min');
    } else {
        prev.set('explorer_interviews_min', min);
    }

    if (max === globalMax) {
        prev.delete('explorer_interviews_max');
    } else {
        prev.set('explorer_interviews_max', max);
    }

    return prev;
};

export const applyCollectionRangeParams = (
    prev,
    min,
    max,
    globalMin,
    globalMax
) => {
    if (min === globalMin) {
        prev.delete('explorer_collections_min');
    } else {
        prev.set('explorer_collections_min', min);
    }

    if (max === globalMax) {
        prev.delete('explorer_collections_max');
    } else {
        prev.set('explorer_collections_max', max);
    }

    return prev;
};

export const applyInstArchiveRangeParams = (
    prev,
    min,
    max,
    globalMin,
    globalMax
) => {
    if (min === globalMin) {
        prev.delete('explorer_inst_archives_min');
    } else {
        prev.set('explorer_inst_archives_min', min);
    }

    if (max === globalMax) {
        prev.delete('explorer_inst_archives_max');
    } else {
        prev.set('explorer_inst_archives_max', max);
    }

    return prev;
};

/**
 * Sets or removes `explorer_year_min` / `explorer_year_max`
 * search params. Values equal to the global bounds are removed (clean URL).
 *
 * @param {URLSearchParams} prev
 * @param {number} min
 * @param {number} max
 * @param {number} globalMin
 * @param {number} globalMax
 * @returns {URLSearchParams}
 */
export const applyYearRangeParams = (prev, min, max, globalMin, globalMax) => {
    if (min === globalMin) {
        prev.delete('explorer_year_min');
    } else {
        prev.set('explorer_year_min', min);
    }

    if (max === globalMax) {
        prev.delete('explorer_year_max');
    } else {
        prev.set('explorer_year_max', max);
    }

    return prev;
};

/**
 * Sets or removes the `explorer_institution` search param.
 * Accepts an array of ids; stores them comma-separated for a clean URL.
 *
 * @param {URLSearchParams} prev
 * @param {number[]} institutionIds
 * @returns {URLSearchParams}
 */
export const applyInstitutionParam = (prev, institutionIds) => {
    if (institutionIds && institutionIds.length > 0) {
        prev.set('explorer_institution', institutionIds.join(','));
    } else {
        prev.delete('explorer_institution');
    }
    return prev;
};
