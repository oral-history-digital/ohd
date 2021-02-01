import React from 'react';
import { Form } from 'modules/forms';
import SingleTextInputFormContainer from '../containers/SingleTextInputFormContainer';
import { t, admin, permittedInterviewEditColumns } from '../../../lib/utils';

export default class SelectInterviewEditViewColumnsForm extends React.Component {

    constructor(props) {
        super(props);
    }

    selectedValues() {
        let values = {};
        this.props.selectedInterviewEditViewColumns.map( column => {
            values[column] = true;
        })
        return values;
    }

    formElements() {
        return permittedInterviewEditColumns(this.props, this.props.interview.id).map( column => {
            return ({
                elementType: 'input',
                type: 'checkbox',
                attribute: column,
                labelKey: `edit_column_header.${column}`,
            })
        })
    }

    selectInterviewEditViewColumns(params) {
        event.preventDefault;
        let values = [];
        Object.keys(params.select_interview_edit_columns).map( column => {
            if (params.select_interview_edit_columns[column])
                values.push(column);
        })
        this.props.selectInterviewEditViewColumns(values);
        this.props.closeArchivePopup();
    }

    render() {
        let _this = this;
        return (
            <div>
                <Form
                    scope='select_interview_edit_columns'
                    onSubmit={function(params){_this.selectInterviewEditViewColumns(params)}}
                    values={_this.selectedValues()}
                    elements={_this.formElements()}
                />
            </div>
        )
    }
}
