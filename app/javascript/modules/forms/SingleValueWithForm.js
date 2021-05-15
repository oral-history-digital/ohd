import React from 'react';

import { Form } from 'modules/forms';
import { humanReadable } from 'modules/data';
import { underscore } from 'modules/strings';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import ContentField from './ContentField';

export default class SingleValueWithForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            collapsed: this.props.collapse,
            value: this.props.value
        };
        this.setEditing = this.setEditing.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    setEditing() {
        this.setState({editing: !this.state.editing});
    }

    editButton() {
        if (admin(this.props, this.props.obj, 'update')) {
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
    }

    toggle() {
        if (this.props.collapse) {
            return (
                <span
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, this.state.collapsed ? 'show' : 'hide')}
                    onClick={() => this.setState({ collapsed: !this.state.collapsed })}
                >
                    <i className={`fa fa-angle-${this.state.collapsed ? 'down' : 'up'}`}></i>
                </span>
            )
        }
    }

    label() {
        return this.props.metadataField && this.props.metadataField.label && this.props.metadataField.label[this.props.locale] ||
            t(this.props, `activerecord.attributes.${underscore(this.props.obj.type)}.${this.attribute()}`);
    }

    attribute() {
        return (this.props.metadataField && this.props.metadataField.name) || this.props.attribute;
    }

    formElements() {
        let elements = [
            {
                elementType: this.props.elementType,
                multiLocale: this.props.multiLocale,
                attribute: this.attribute(),
                label: this.label(),
                validate: this.props.validate,
                data: this.props.obj,
                values: this.props.values,
                withEmpty: this.props.withEmpty,
                individualErrorMsg: this.props.individualErrorMsg,
                optionsScope: this.props.optionsScope,
                handlechangecallback: this.handleChange
            }
        ];

        let statusCheckbox = {
            elementType: 'input',
            attribute: `public_attributes[${this.attribute()}]`,
            value: this.props.obj.properties.public_attributes && this.props.obj.properties.public_attributes[this.attribute()],
            labelKey: 'activerecord.attributes.default.publish',
            type: 'checkbox',
        };

        if (this.props.noStatusCheckbox) {
            return elements;
        } else {
            return elements.concat(statusCheckbox);
        }
    }

    handleChange(name, value) {
        this.setState({value: value});
    }

    form() {
        let _this = this;
        return (
            <Form
                scope={underscore(this.props.obj.type)}
                onSubmit={function(params){_this.props.submitData(_this.props, params, {updateStateBeforeSubmit: true}); _this.setEditing()}}
                cancel={_this.setEditing}
                formClasses='default single-value'
                className="ContentField"
                data={this.props.obj}
                elements={_this.formElements()}
            />
        )
    }

    show() {
        if (
            admin(this.props, this.props.obj, 'show') ||
            (
                (
                    (this.props.isLoggedIn && this.props.metadataField && this.props.metadataField.use_in_details_view) ||
                    (!this.props.isLoggedIn && this.props.metadataField && this.props.metadataField.display_on_landing_page)
                ) &&
                (this.props.obj.properties.public_attributes && this.props.obj.properties.public_attributes[this.attribute()])
            )
        ) {
            let value = humanReadable(this.props.obj, this.attribute(), this.props, this.state);
            return (
                <ContentField noLabel={this.props.noLabel} label={this.label()} value={value} >
                    {this.toggle()}
                    {this.props.children}
                    {this.editButton()}
                </ContentField>
            )
        } else {
            return null;
        }
    }

    render() {
        const isEditMode = admin(this.props, this.props.obj, 'update') && this.state.editing;
        return isEditMode ? this.form() : this.show();
    }
}
