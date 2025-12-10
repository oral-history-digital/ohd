import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import tableHeader from '../tableHeader';
import EditTableHeaderOptions from './EditTableHeaderOptions';
import useColumns from './useColumns';

export default function EditTableHeader({ numElements, interview }) {
    const { t } = useI18n();
    const { columns, gridTemplateColumns } = useColumns(interview);

    return (
        <header className="EditTableHeader">
            <EditTableHeaderOptions numElements={numElements} />
            <div
                className="EditTableHeader-columns"
                style={{ gridTemplateColumns }}
            >
                {columns.map((column) => (
                    <div key={column} className="EditTableHeader-cell">
                        {tableHeader({ interview, column, t })}
                    </div>
                ))}
            </div>
        </header>
    );
}

EditTableHeader.propTypes = {
    numElements: PropTypes.number.isRequired,
    interview: PropTypes.object.isRequired,
};
