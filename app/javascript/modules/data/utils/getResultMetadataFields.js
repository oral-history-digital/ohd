/**
 * Selects and orders metadata fields for search results without changing the stored array.
 * The API retains the legacy flags: results_table selects grid fields, results_list selects table columns.
 *
 * @param {Object[]} [fields=[]] - Project metadata configuration.
 * @param {'grid'|'table'} view - Search result view.
 * @returns {Object[]} Fields in display order, with unset positions first.
 */
export function getResultMetadataFields(fields = [], view) {
    const flag =
        view === 'grid' ? 'use_in_results_table' : 'use_in_results_list';
    return fields
        .filter((field) => field[flag])
        .sort((first, second) => {
            const firstOrder = first.list_columns_order ?? -Infinity;
            const secondOrder = second.list_columns_order ?? -Infinity;
            if (firstOrder === secondOrder) return first.id - second.id;
            return firstOrder < secondOrder ? -1 : 1;
        });
}
