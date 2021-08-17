import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import permittedColumns from './permittedColumns';
import EditTableHeaderOptions from './EditTableHeaderOptions';

export default function EditTableHeader({
    numElements,
    account,
    editView,
    project,
    interview,
    selectedInterviewEditViewColumns,
}) {
    const { t } = useI18n();

    const columns = selectedInterviewEditViewColumns.filter(
        v => permittedColumns({ account, editView, project }, interview.id).includes(v)
    );

    return (
        <header className="EditTableHeader">
            <EditTableHeaderOptions
                numElements={numElements}
            />
            <div
                className="EditTableHeader-columns"
                style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
            >
                {
                    columns.map(column => (
                        <div
                            key={column}
                            className="EditTableHeader-cell"
                        >
                            {t(`edit_column_header.${column}`)}
                        </div>
                    ))
                }
            </div>

        </header>
    );
}

EditTableHeader.propTypes = {
    numElements: PropTypes.number.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    selectedInterviewEditViewColumns: PropTypes.array.isRequired,
};
