import { useMemo } from 'react';

/**
 * Finds the interview-count maximum for projects or institutions.
 * The lower slider bound stays zero, including when all counts are positive.
 *
 * @param {Object} options - Items and the field holding their interview counts.
 * @param {Object[]} options.items - Project or institution summaries.
 * @param {string} [options.countField='interviews'] - Projects use interview_counts; institutions use interviews.
 * @returns {{globalMin: number, globalMax: number}} Zero-based range, or zeros for an empty list.
 */
export function useExplorerInterviewRange({
    items,
    countField = 'interviews',
}) {
    return useMemo(() => {
        const counts = items
            .map((item) => item[countField]?.total ?? 0)
            .filter((n) => Number.isFinite(n));

        const safeMax = counts.length > 0 ? Math.max(...counts) : 0;

        return {
            globalMin: 0,
            globalMax: safeMax,
        };
    }, [items, countField]);
}
