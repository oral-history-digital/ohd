import { useState, useMemo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import { Pagination, PAGINATION_DEFAULT_PAGE_SIZE } from 'modules/ui';
import Filter from './Filter';
import Table from './Table';

export default function TableWithPagination({
    className,
    columns,
    data,
    isLoading,
    manualPagination,
    manualFiltering,
    manualFilterFunc,
    manualFilter,
    manualSorting,
    manualSortFunc,
    manualSort,
    changePageSize = true,
    setPage,
    pageCount,
    children,
}) {
    const [sorting, setSorting] = useState(manualSort || []);
    const [globalFilter, setGlobalFilter] = useState(manualFilter || '');

    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: PAGINATION_DEFAULT_PAGE_SIZE,
    });

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const sortFunc = m => {
        if (manualSorting) {
            manualSortFunc(m);
            setSorting(m);
        } else {
            setSorting(m);
        }
    }

    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            globalFilter,
            pagination,
            sorting,
        },
        globalFilterFn: 'includesString',
        onPaginationChange: setPagination,
        onSortingChange: sortFunc,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: manualPagination,
        manualFiltering: manualFiltering,
        manualSorting: false,
        pageCount: pageCount,
    });

    return (
        <div className={classNames(className)}>
            <Filter
                className="u-mb-small"
                value={globalFilter}
                onChange={value => {
                    setGlobalFilter(value);
                    if (typeof manualFilterFunc === 'function') manualFilterFunc(value);
                    if (typeof(setPage) === 'function') setPage(1);
                }}
            />
            {children}
            <Pagination
                className="u-mb"
                page={table.getState().pagination.pageIndex + 1}
                pageCount={table.getPageCount()}
                pageSize={table.getState().pagination.pageSize}
                onPageChange={page => {table.setPageIndex(page - 1); if (typeof(setPage) === 'function') setPage(page);}}
                onPageSizeChange={table.setPageSize}
                changePageSize={changePageSize}
            />
            <Table table={table} isLoading={isLoading} />
            <Pagination
                className="u-mt"
                page={table.getState().pagination.pageIndex + 1}
                pageCount={table.getPageCount()}
                pageSize={table.getState().pagination.pageSize}
                onPageChange={page => {table.setPageIndex(page - 1); if (typeof(setPage) === 'function') setPage(page);}}
                onPageSizeChange={table.setPageSize}
                changePageSize={changePageSize}
            />
        </div>
    );
}

TableWithPagination.propTypes = {
    className: PropTypes.string,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array,
    isLoading: PropTypes.bool,
};
