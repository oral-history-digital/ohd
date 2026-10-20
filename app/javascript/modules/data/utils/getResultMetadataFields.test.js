import { getResultMetadataFields } from './getResultMetadataFields';

test('selects each view and preserves configured order without changing Redux data', () => {
    const fields = [
        { id: 6, use_in_results_list: true, list_columns_order: 2 },
        { id: 3, use_in_results_table: true, list_columns_order: null },
        { id: 2, use_in_results_list: true, list_columns_order: -1 },
        { id: 4, use_in_results_list: true, list_columns_order: null },
        { id: 5, use_in_results_list: true, list_columns_order: 2 },
        { id: 1, use_in_results_table: true, list_columns_order: 1 },
        { id: 7 },
    ];
    expect(getResultMetadataFields(fields, 'grid').map(({ id }) => id)).toEqual(
        [3, 1]
    );
    expect(
        getResultMetadataFields(fields, 'table').map(({ id }) => id)
    ).toEqual([4, 2, 5, 6]);
    expect(fields.map(({ id }) => id)).toEqual([6, 3, 2, 4, 5, 1, 7]);
    expect(getResultMetadataFields(undefined, 'grid')).toEqual([]);
});
