import { Component } from 'react';

import { Form, SingleTextInputFormContainer } from 'modules/forms';
import { t } from 'modules/i18n';

export default class MarkTextForm extends Component {

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
            <span>{value.text_to_mark}: {value.replacement}</span>
        )
    }

    returnToForm() {
        this.setState({showForm: true});
    }

    form() {
        let _this = this;
        if (
            this.state.showForm
        ) {
            return (
                <Form
                    scope='mark_text'
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.setState({showForm: false})}}
                    helpTextCode="mark_text_form"
                    values={{
                        id: this.props.interview.archive_id
                    }}
                    elements={[
                        {
                            elementType: 'select',
                            attribute: 'locale',
                            values: this.props.interview.languages,
                            withEmpty: true,
                            validate: function(v){return v !== ''},
                            individualErrorMsg: 'empty'
                        },
                    ]}

                    nestedScopeProps={[{
                        formComponent: SingleTextInputFormContainer,
                        formProps: {},
                        parent: this.props.interview,
                        scope: 'text',
                        elementRepresentation: this.showMarkedText,
                    }]}
                />
            )
        }
    }

    msg() {
        let text = this.props.markTextStatus[`for_interviews_${this.props.archiveId}`] ?
            t(this.props, 'edit.text.' + this.props.markTextStatus[`for_interviews_${this.props.archiveId}`]) :
            t(this.props, 'edit.mark_text.explanation')
        if (
            //this.props.markTextStatus[`for_interviews_${this.props.archiveId}`]
            //!this.state.showForm
            true
        ) {
            return (
                <div>
                    <p>
                        {text}
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
