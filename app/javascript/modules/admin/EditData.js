import { Component } from 'react';

import { Form } from 'modules/forms';
import { humanReadable } from 'modules/data';
import { t } from 'modules/i18n';

export default class EditData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            collapsed: true
        };
        this.setEditing = this.setEditing.bind(this);
    }

    setEditing() {
        this.setState({editing: !this.state.editing});
    }

    editButton() {
        return (
            <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, `edit.default.${this.state.editing ? 'cancel' : 'edit'}`)}
                onClick={() => this.setEditing()}
            >
                <i className={`fa fa-${this.state.editing ? 'times' : 'pencil'}`}></i>
            </span>
        )
    }

    form() {
        return (
            <Form
                data={this.props.data}
                values={this.props.initialFormValues}
                scope={this.props.scope}
                onSubmit={(params) => {
                    this.props.submitData(this.props, params);
                    this.setEditing()
                }}
                cancel={this.setEditing}
                submitText='submit'
                elements={this.props.formElements}
            />
        )
    }

    show() {
        const { data, translations, locale, scope } = this.props;
        return (
            <>
                {this.props.formElements.map((element) => {
                    return (
                        <p>
                            <span className="flyout-content-label">
                                {t({translations, locale}, `activerecord.attributes.${scope}.${element.attribute}`)}:
                            </span>
                            <span className={'flyout-content-data'}>
                                {humanReadable(data, element.attribute, {translations, locale}, this.state)}
                            </span>
                        </p>
                    )
                })}
                {this.editButton()}
            </>
        )
    }

    render() {
        return <>{this.state.editing ? this.form() : this.show()}</>
    }
}
