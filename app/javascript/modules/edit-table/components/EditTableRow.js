import PropTypes from 'prop-types';
import classNames from 'classnames';

import EditTableCell from './EditTableCell';
import useColumns from './useColumns';

export default function TableRow({
    odd,
    segment,
    active,
    originalLocale,
    translationLocale,
    interview,
}) {
    const { columns, gridTemplateColumns } = useColumns(interview);

    return (
        <div
            className={classNames('EditTable-row', 'segment-row_old',
                odd ? 'EditTable-row--odd' : 'EditTable-row--even',
                { 'is-active': active })}
            style={{ gridTemplateColumns }}
        >
            {
                columns.map(column => (
                    <EditTableCell
                        key={column}
                        type={column}
                        segment={segment}
                        originalLocale={originalLocale}
                        translationLocale={translationLocale}
                    />
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
    interview: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
};
