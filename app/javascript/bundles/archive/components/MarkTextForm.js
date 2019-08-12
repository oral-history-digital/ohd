import React from 'react';
import Form from '../containers/form/Form';
import SingleTextInputFormContainer from '../containers/SingleTextInputFormContainer';
import { t } from '../../../lib/utils';

export default class MarkTextForm extends React.Component {

    constructor(props) {
        super(props);
        this.showMarkedText = this.showMarkedText.bind(this);
        this.returnToForm = this.returnToForm.bind(this);
        this.state = {
            showForm: true
        };
    }

    showMarkedText(value) {
        return (
            <span>{value.text_to_mark}</span>
        )
    }

    returnToForm() {
        this.setState({showForm: true});
    }

    form() {
        if (
            this.state.showForm
        ) {
            return (
                <Form 
                    scope='mark_text'
                    onSubmit={this.props.submitData}
                    values={{
                        id: this.props.interview && this.props.interview.archive_id
                    }}
                    elements={[
                        {
                            elementType: 'select',
                            attribute: 'locale',
                            values: this.props.interview && this.props.interview.languages,
                            withEmpty: true,
                            validate: function(v){return v !== ''},
                            individualErrorMsg: 'empty'
                        },
                    ]}
                    subForm={SingleTextInputFormContainer}
                    subFormProps={{}}
                    subFormScope='text'
                    subScopeRepresentation={this.showMarkedText}
                />
            )
        }
    }

    msg() {
        if (
            //this.props.markTextStatus[`for_interviews_${this.props.archiveId}`]
            !this.state.showForm
        ) {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.text.' + this.props.markTextStatus[`for_interviews_${this.props.archiveId}`])}
                    </p>
                    <button 
                        className='return-to-upload'
                        onClick={() => this.returnToForm()}
                    >
                        {t(this.props, 'edit.upload.return')}
                    </button>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.msg()}
                {this.form()}
            </div>
        )
    }
}
