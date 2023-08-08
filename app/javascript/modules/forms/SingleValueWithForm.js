import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTimes, FaAngleUp, FaAngleDown } from 'react-icons/fa';

import { Form } from 'modules/forms';
import { humanReadable } from 'modules/data';
import { underscore } from 'modules/strings';
import { admin, AuthorizedContent } from 'modules/auth';
import { t } from 'modules/i18n';
import ContentField from './ContentField';

export default class SingleValueWithForm extends Component {

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
        const { editing } = this.state;


    }

    label() {
        return this.metadataField()?.label && this.metadataField().label[this.props.locale] ||
            t(this.props, `activerecord.attributes.${underscore(this.props.obj.type)}.${this.props.attribute}`);
    }

    formElements() {
        let elements = [
            {
                elementType: this.props.elementType,
                type: this.props.type,
                multiLocale: this.props.multiLocale,
                attribute: this.props.attribute,
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
            attribute: `public_attributes[${this.props.attribute}]`,
            value: this.props.obj.properties?.public_attributes?.[this.props.attribute]?.toString() === 'true',
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
                onCancel={_this.setEditing}
                formClasses='default single-value'
                className="ContentField"
                data={this.props.obj}
                elements={_this.formElements()}
            />
        )
    }

    metadataField() {
        return Object.values(this.props.project.metadata_fields).find(m => m.name === this.props.attribute);
    }

    show() {
        const { readOnly, projectAccessGranted, obj, attribute, noLabel, linkUrls,
            collapse, children } = this.props;
        const { collapsed, editing } = this.state;

        const metadataField = this.metadataField();

        if (
            admin(this.props, obj, 'update') && typeof metadataField !== 'undefined' ||
            (
                (
                    (projectAccessGranted && metadataField?.use_in_details_view) ||
                    (!projectAccessGranted && metadataField?.display_on_landing_page)
                ) &&
                (obj.properties?.public_attributes?.[attribute]?.toString() === 'true')
            )
        ) {
            let value = humanReadable(obj, attribute, this.props, this.state);
            return (
                <ContentField
                    noLabel={noLabel}
                    label={this.label()}
                    value={value}
                    linkUrls={linkUrls}
                >
                    {
                        !readOnly && (
                            <>
                                {
                                    collapse && (
                                        <button
                                            type="button"
                                            className="Button Button--transparent Button--icon"
                                            title={t(this.props, this.state.collapsed ? 'show' : 'hide')}
                                            onClick={() => this.setState({ collapsed: !this.state.collapsed })}
                                        >
                                            {
                                                collapsed ?
                                                    <FaAngleDown className="Icon Icon--editorial" /> :
                                                    <FaAngleUp className="Icon Icon--editorial" />
                                            }
                                        </button>
                                    )
                                }
                                {children}
                                <AuthorizedContent object={obj} action="update">
                                    <button
                                        type="button"
                                        className="Button Button--transparent Button--icon"
                                        title={t(this.props, `edit.default.${this.state.editing ? 'cancel' : 'edit'}`)}
                                        onClick={() => this.setEditing()}
                                    >
                                        {
                                            editing ?
                                                <FaTimes className="Icon Icon--editorial" /> :
                                                <FaPencilAlt className="Icon Icon--editorial" />
                                        }
                                    </button>
                                </AuthorizedContent>
                            </>
                        )
                    }
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

SingleValueWithForm.propTypes = {
    obj: PropTypes.object,
    attribute: PropTypes.string,
    readOnly: PropTypes.bool,
    linkUrls: PropTypes.bool,
};
