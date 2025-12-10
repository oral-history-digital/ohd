import { flexRender } from '@tanstack/react-table';
import PropTypes from 'prop-types';

export default function TableBody({ table }) {
    return (
        <tbody className="Table-body">
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="Table-row">
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="Table-cell">
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
}

TableBody.propTypes = {
    table: PropTypes.object.isRequired,
};
