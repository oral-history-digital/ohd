import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import useColumns from './useColumns';

export default function SelectColumnsForm({
    interview,
    selectedColumns,
    setColumns,
    onSubmit,
}) {
    const { permittedColumns } = useColumns(interview);

    const selectedValues = () => {
        let values = {};
        selectedColumns.forEach(column => {
            values[column] = true;
        })
        return values;
    };

    const formElements = () => permittedColumns
        .map(column => ({
            elementType: 'input',
            type: 'checkbox',
            attribute: column,
            labelKey: `edit_column_header.${column}`,
        }));

    const handleSelect = (params) => {
        let values = [];
        Object.keys(params.select_interview_edit_columns).map( column => {
            if (params.select_interview_edit_columns[column])
                values.push(column);
        })
        setColumns(values);
        onSubmit();
    };

    return (
        <div>
            <Form
                scope="select_interview_edit_columns"
                onSubmit={handleSelect}
                values={selectedValues()}
                elements={formElements()}
            />
        </div>
    );
}

SelectColumnsForm.propTypes = {
    interview: PropTypes.object.isRequired,
    selectedColumns: PropTypes.array.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    setColumns: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};