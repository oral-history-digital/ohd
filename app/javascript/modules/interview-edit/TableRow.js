import { useState } from 'react';
import PropTypes from 'prop-types';
import VizSensor from 'react-visibility-sensor/visibility-sensor';

import permittedColumns from './permittedColumns';
import TableCell from './TableCell';

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
    const [isVisible, setIsVisible] = useState(false);

    const columns = selectedInterviewEditViewColumns.filter(
        v => permittedColumns({ account, editView, project }, interview.id).includes(v)
    );

    return (
        <VizSensor
            partialVisibility
            onChange={setIsVisible}
        >
            <tr className="EditTable-row segment-row_old">
                {
                    columns.map(column => (
                        <td
                            key={column}
                            className="EditTable-cell"
                        >
                            {
                                isVisible && (
                                    <TableCell
                                        type={column}
                                        segment={segment}
                                        originalLocale={originalLocale}
                                        translationLocale={translationLocale}
                                    />
                                )
                            }
                        </td>
                    ))
                }
            </tr>
        </VizSensor>
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
