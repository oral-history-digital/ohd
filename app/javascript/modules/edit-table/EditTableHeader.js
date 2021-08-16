import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import permittedColumns from './permittedColumns';

export default function EditTableHeader({
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
        <div>
            <div
                className="EditTable-row"
                style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
            >
                {
                    columns.map(column => (
                        <div
                            key={column}
                            className={classNames('EditTable-cell', 'EditTable-cell--header', {
                                'EditTable-cell--narrow': column === 'timecode',
                            })}
                        >
                            {t(`edit_column_header.${column}`)}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

EditTableHeader.propTypes = {
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    selectedInterviewEditViewColumns: PropTypes.array.isRequired,
};
