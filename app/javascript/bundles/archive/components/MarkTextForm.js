import React from 'react';
import Form from '../containers/form/Form';
import SingleTextInputFormContainer from '../containers/SingleTextInputFormContainer';
import { t } from '../../../lib/utils';

export default class MarkTextForm extends React.Component {

    constructor(props) {
        super(props);
        this.showMarkedText = this.showMarkedText.bind(this);
        this.state = {};
    }

    showMarkedText(value) {
        return (
            <span>{value.text_to_mark}</span>
        )
    }

    returnToForm() {
        this.props.returnToForm('interviews');
    }

    form() {
        return (
            <Form 
                scope='mark_text'
                onSubmit={this.props.submitData}
                values={{
                    id: this.props.interview.archive_id
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

    msg() {
        if (
            this.props.markTextStatus[`for_interviews_${this.props.archiveId}`]
        ) {
            return (
                <div>
                    <p>
                        {t(this.props, 'edit.update_speaker.' + this.props.markTextStatus[`for_interviews_${this.props.archiveId}`])}
                    </p>
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
