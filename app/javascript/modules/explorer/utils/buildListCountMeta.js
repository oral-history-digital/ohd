/**
 * Builds count metadata for list headers.
 *
 * @param {Array|number|null|undefined} displayedItems - Items currently displayed or a count.
 * @param {Array|number|null|undefined} totalItems - All available items or a count.
 * @returns {{count: number, total: number, hasActiveFilter: boolean}}
 */
export function buildListCountMeta(displayedItems, totalItems) {
    const count = Array.isArray(displayedItems)
        ? displayedItems.length
        : Number(displayedItems) || 0;
    const total = Array.isArray(totalItems)
        ? totalItems.length
        : Number(totalItems) || 0;

    return {
        count,
        total,
        hasActiveFilter: count !== total,
    };
}
