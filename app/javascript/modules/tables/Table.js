import PropTypes from 'prop-types';
import classNames from 'classnames';

import TableHead from './TableHead';
import TableBody from './TableBody';
import { Spinner } from 'modules/spinners';

export default function Table({
    table,
    isLoading = false,
    className
}) {
    if (isLoading) return <Spinner />;

    return (
        <table className={classNames('Table', className, { 'is-loading': isLoading })}>
            <TableHead table={table} />
            <TableBody table={table} />
        </table>
    );
}

Table.propTypes = {
    table: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    className: PropTypes.string
};
