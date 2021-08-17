import PropTypes from 'prop-types';
import classNames from 'classnames';

import permittedColumns from '../permittedColumns';
import EditTableCell from './EditTableCell';

export default function TableRow({
    odd,
    segment,
    active,
    originalLocale,
    translationLocale,
    account,
    editView,
    project,
    interview,
    selectedColumns,
}) {
    const columns = selectedColumns.filter(
        v => permittedColumns({ account, editView, project }, interview.id).includes(v)
    );

    return (
        <div
            className={classNames('EditTable-row', 'segment-row_old',
                odd ? 'EditTable-row--odd' : 'EditTable-row--even',
                { 'is-active': active })}
            style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        >
            {
                columns.map(column => (
                    <div
                        key={column}
                        className="EditTable-cell"
                    >
                        <EditTableCell
                            type={column}
                            segment={segment}
                            originalLocale={originalLocale}
                            translationLocale={translationLocale}
                        />
                    </div>
                ))
            }
        </div>
    );
}

TableRow.propTypes = {
    odd: PropTypes.bool.isRequired,
    segment: PropTypes.object.isRequired,
    originalLocale: PropTypes.string.isRequired,
    translationLocale: PropTypes.string.isRequired,
    selectedColumns: PropTypes.array.isRequired,
    interview: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
};
