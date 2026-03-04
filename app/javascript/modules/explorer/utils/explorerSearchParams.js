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
