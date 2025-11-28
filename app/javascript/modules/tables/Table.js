import classNames from 'classnames';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';

import TableBody from './TableBody';
import TableHead from './TableHead';

export default function Table({ table, isLoading = false, className }) {
    if (isLoading) return <Spinner />;

    return (
        <table
            className={classNames('Table', className, {
                'is-loading': isLoading,
            })}
        >
            <TableHead table={table} />
            <TableBody table={table} />
        </table>
    );
}

Table.propTypes = {
    table: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
};
