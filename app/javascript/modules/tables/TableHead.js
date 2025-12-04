import { flexRender } from '@tanstack/react-table';
import PropTypes from 'prop-types';

import SortButton from './SortButton';

export default function TableHead({ table }) {
    return (
        <thead className="Table-head">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th key={header.id} className="Table-header">
                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                <SortButton
                                    direction={header.column.getIsSorted()}
                                    className="Table-headerButton"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </SortButton>
                            ) : (
                                flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )
                            )}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
}

TableHead.propTypes = {
    table: PropTypes.object.isRequired,
};
