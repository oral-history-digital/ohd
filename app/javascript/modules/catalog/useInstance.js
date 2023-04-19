import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getSortedRowModel,
} from '@tanstack/react-table';

import { useI18n } from 'modules/i18n';
import NameCell from './NameCell';
import HeaderExpander from './HeaderExpander';
import RowExpander from './RowExpander';

function expandInstitutions(state, data, currentPrefix = '') {
    data.forEach((elem, index) => {
        if (elem.type === 'institution') {
            state[`${currentPrefix}${index}`] = true;
        }
        if (elem.subRows) {
            expandInstitutions(state, elem.subRows, `${currentPrefix}${index}.`);
        }
    });
}

export default function useInstance(data, type) {
    const initialExpandedState = {};
    expandInstitutions(initialExpandedState, data);

    const [expanded, setExpanded] = useState(initialExpandedState);
    const [columnFilters, setColumnFilters] = useState([]);
    const [sorting, setSorting] = useState([]);
    const { t, locale } = useI18n();

    let usedColumns;
    switch (type) {
    case 'collection':
        usedColumns = ['name', 'shortname'];
        break;
    case 'main':
    case 'institution':
    case 'archive':
    default:
        usedColumns = ['expander', 'name', 'shortname', 'num_interviews'];
    }

    const columns = useMemo(() => {
        return usedColumns.map(id => {
            switch (id) {
            case 'expander':
                return {
                    accessorKey: 'expander',
                    header: HeaderExpander,
                    cell: RowExpander,
                    enableColumnFilter: false,
                    enableSorting: false,
                };
            case 'shortname':
                return {
                    accessorKey: 'shortname',
                    header: t('modules.catalog.table.shortname'),
                    enableColumnFilter: false,
                };
            case 'name':
                return {
                    accessorKey: 'name',
                    header: t(`modules.catalog.table.name_header.${type}`),
                    cell: NameCell,
                    enableColumnFilter: true,
                };
            case 'num_interviews':
                return {
                    accessorKey: 'num_interviews',
                    header: t('modules.catalog.table.num_interviews'),
                    enableColumnFilter: false,
                };
            default:
                throw new TypeError(`Column id '${id}' unknown`);
            }
        });
    }, [locale]);

    const instance = useReactTable({
        data,
        columns,
        state: {
            expanded,
            columnFilters,
            sorting,
        },
        filterFromLeafRows: true,
        onExpandedChange: setExpanded,
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getSortedRowModel: getSortedRowModel(),
        getSubRows: row => row.subRows,
    });

    return { instance };
}
