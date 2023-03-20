import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import useColumns from './useColumns';

export default function SelectColumnsForm({
    interview,
    selectedColumns,
    setColumns,
    onSubmit,
    onCancel,
}) {
    const { permittedColumns } = useColumns(interview);

    const handleSelect = (params) => {
        let values = [];
        Object.keys(params.select_interview_edit_columns).map( column => {
            if (params.select_interview_edit_columns[column])
                values.push(column);
        })
        setColumns(values);
        onSubmit();
    };

    const formElements = permittedColumns.map(column => ({
        elementType: 'input',
        type: 'checkbox',
        attribute: column,
        labelKey: `edit_column_header.${column}`,
    }));

    const selectedValues = {};
    permittedColumns.forEach(column => {
        selectedValues[column] = selectedColumns.includes(column);
    });

    return (
        <div>
            <Form
                scope="select_interview_edit_columns"
                onSubmit={handleSelect}
                onCancel={onCancel}
                values={selectedValues}
                elements={formElements}
            />
        </div>
    );
}

SelectColumnsForm.propTypes = {
    interview: PropTypes.object.isRequired,
    selectedColumns: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    setColumns: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
