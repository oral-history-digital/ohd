import PropTypes from 'prop-types';
import classNames from 'classnames';

import permittedColumns from './permittedColumns';
import EditTableCell from './EditTableCell';

export default function TableRow({
    segment,
    active,
    originalLocale,
    translationLocale,
    account,
    editView,
    project,
    interview,
    selectedInterviewEditViewColumns,
}) {
    const columns = selectedInterviewEditViewColumns.filter(
        v => permittedColumns({ account, editView, project }, interview.id).includes(v)
    );

    return (
        <tr className={classNames('EditTable-row', 'segment-row_old', {
            'is-active': active,
        })}>
            {
                columns.map(column => (
                    <td
                        key={column}
                        className="EditTable-cell"
                    >
                        <EditTableCell
                            type={column}
                            segment={segment}
                            originalLocale={originalLocale}
                            translationLocale={translationLocale}
                        />
                    </td>
                ))
            }
        </tr>
    );
}

TableRow.propTypes = {
    segment: PropTypes.object.isRequired,
    originalLocale: PropTypes.string.isRequired,
    translationLocale: PropTypes.string.isRequired,
    selectedInterviewEditViewColumns: PropTypes.array.isRequired,
    interview: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
};
