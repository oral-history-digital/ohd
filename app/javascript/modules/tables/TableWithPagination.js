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
    isLoading
}) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

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
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className={classNames(className)}>
            <Filter
                className="u-mb-small"
                value={globalFilter}
                onChange={setGlobalFilter}
            />
            <Pagination
                className="u-mb"
                page={table.getState().pagination.pageIndex + 1}
                pageCount={table.getPageCount()}
                pageSize={table.getState().pagination.pageSize}
                onPageChange={page => table.setPageIndex(page - 1)}
                onPageSizeChange={table.setPageSize}
            />
            <Table table={table} isLoading={isLoading} />
            <Pagination
                className="u-mt"
                page={table.getState().pagination.pageIndex + 1}
                pageCount={table.getPageCount()}
                pageSize={table.getState().pagination.pageSize}
                onPageChange={page => table.setPageIndex(page - 1)}
                onPageSizeChange={table.setPageSize}
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