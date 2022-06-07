/* eslint-disable react/jsx-key */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { flexRender } from '@tanstack/react-table';

import SortButton from './SortButton';
import Filter from './Filter';

export default function CatalogTable({
    instance,
    className,
}) {
    return (
        <div className={classNames('CatalogTable', className)}>
            <table className="CatalogTable-table">
                <thead>
                    {instance.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className="CatalogTable-header"
                                >
                                    <button
                                        className="Button Button--transparent Button--withoutPadding u-align-right"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.column.getCanSort() ? (
                                            <SortButton direction={header.column.getIsSorted()}>
                                                {header.isPlaceholder ?
                                                    null :
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                }
                                            </SortButton>
                                        ) : (
                                            header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                                        )}
                                    </button>
                                    {header.column.getCanFilter() ? (
                                        <div>
                                            <Filter column={header.column} table={instance} />
                                        </div>
                                    ) : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="CatalogTable-body">
                    {instance.getRowModel().rows.map(row => {
                        return (
                            <tr
                                className={classNames('CatalogTable-row', {
                                    'CatalogTable-row--institution': row.original.type === 'institution',
                                    'CatalogTable-row--archive': row.original.type === 'project',
                                    'CatalogTable-row--collection': row.original.type === 'collection',
                                    'CatalogTable-row--interview': row.original.type === 'interview',
                                })}
                                key={row.id}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className={classNames('CatalogTable-cell', {
                                            'CatalogTable-cell--number': cell.column.id === 'num_interviews'
                                        })}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

CatalogTable.propTypes = {
    instance: PropTypes.object.isRequired,
    className: PropTypes.string,
};
