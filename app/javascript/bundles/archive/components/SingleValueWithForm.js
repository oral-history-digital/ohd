import React from 'react';
import Form from '../containers/form/Form';
import ContentFieldContainer from '../containers/ContentFieldContainer';
import { t, admin, underscore } from '../../../lib/utils';

export default class SingleValueWithForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            collapsed: this.props.collapse
        };
        this.setEditing = this.setEditing.bind(this);
    }

    setEditing() {
        this.setState({editing: !this.state.editing});
    }

    editButton() {
        if (admin(this.props, this.props.obj)) {
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

    form() {
        let _this = this;
        return (
            <Form 
                scope={underscore(this.props.obj.type)}
                onSubmit={function(params){_this.props.submitData(_this.props, params, {updateStateBeforeSubmit: true}); _this.setEditing()}}
                cancel={_this.setEditing}
                formClasses='default single-value'
                data={this.props.obj}
                elements={[
                    {
                        elementType: this.props.elementType,
                        attribute: this.attribute(),
                        label: this.label(),
                        validate: this.props.validate,
                        data: this.props.obj,
                        values: this.props.values,
                        withEmpty: this.props.withEmpty,
                        individualErrorMsg: this.props.individualErrorMsg,
                        optionsScope: this.props.optionsScope
                    },
                    {
                        elementType: 'input',
                        attribute: `properties[public_attributes][${this.attribute()}]`,
                        value: this.props.obj.properties.public_attributes && this.props.obj.properties.public_attributes[this.attribute()],
                        labelKey: 'activerecord.attributes.default.publish',
                        type: 'checkbox',
                    },
                ]}
            />
        )
    }

    show() {
        if (
            admin(this.props, this.props.obj) ||
            (
                (
                    (this.props.isLoggedIn && this.props.metadataField && this.props.metadataField.use_in_details_view) ||
                    (!this.props.isLoggedIn && this.props.metadataField && this.props.metadataField.display_on_landing_page) 
                ) && 
                (this.props.obj.properties.public_attributes && this.props.obj.properties.public_attributes[this.attribute()])
            )
        ) {

            let translation = this.props.obj.translations && this.props.obj.translations.find(t => t.locale === this.props.locale)
            let value = this.props.value || this.props.obj[this.attribute()] || (translation && translation[this.attribute()]) || '---';

            if (/\w+_id/.test(this.attribute()) && this.attribute() !== 'archive_id') // get corresponding name from e.g. collection_id
                value = this.props.values[value] && this.props.values[value].name

            if (typeof value === 'object' && value !== null)
                value = value[this.props.locale]

            if (typeof value === 'string' && this.state.collapsed) 
                value = value.substring(0,25)

            return (
                <ContentFieldContainer label={this.label()} value={value} >
                    {this.toggle()}
                    {this.props.children}
                    {this.editButton()}
                </ContentFieldContainer>
            )
        } else {
            return null;
        }
    }

    render() {
        let edit = admin(this.props, this.props.obj) && this.state.editing
        return (
            <div>
                {edit ? this.form() : this.show()}
            </div>
        )
    }

}
