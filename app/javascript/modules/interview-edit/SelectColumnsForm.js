import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import permittedColumns from './permittedColumns';

export default function SelectColumnsForm({
    interview,
    selectedInterviewEditViewColumns,
    account,
    editView,
    selectInterviewEditViewColumns,
    onSubmit,
}) {
    const selectedValues = () => {
        let values = {};
        selectedInterviewEditViewColumns.forEach( column => {
            values[column] = true;
        })
        return values;
    };

    const formElements = () => permittedColumns({ account, editView }, interview.id)
        .map(column => ({
            elementType: 'input',
            type: 'checkbox',
            attribute: column,
            labelKey: `edit_column_header.${column}`,
        }));

    const handleSelect = (params) => {
        console.log(params);
        event.preventDefault;
        let values = [];
        Object.keys(params.select_interview_edit_columns).map( column => {
            if (params.select_interview_edit_columns[column])
                values.push(column);
        })
        selectInterviewEditViewColumns(values);
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
    selectedInterviewEditViewColumns: PropTypes.array.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    selectInterviewEditViewColumns: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
