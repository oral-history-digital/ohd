import React from 'react';
import Form from '../containers/form/Form';
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

    form() {
        let _this = this;
        return (
            <Form 
                scope={underscore(this.props.obj.type)}
                onSubmit={function(params){_this.props.submitData(_this.props, params); _this.setEditing()}}
                values={{id: this.props.obj.type === 'Interview' ? this.props.obj.archive_id : this.props.obj.id}}
                elements={[
                    {
                        elementType: this .props.elementType,
                        attribute: this.props.attribute || this.props.metadataField.name,
                        validate: this.props.validate,
                        value: this.props.obj[this.props.attribute],
                        values: this.props.values,
                        withEmpty: this.props.withEmpty,
                        individualErrorMsg: this.props.individualErrorMsg,
                        optionsScope: this.props.optionsScope
                    },
                ]}
            />
        )
    }

    show() {
        //let label = this.props.metadataField.label && this.props.metadataField.label[this.props.locale] || t(this.props, this.props.metadataField.name);
        //let value = this.props.obj[this.props.metadataField.name] || '---';
        //if (typeof value === 'string' && !/\d{2,4}/.test(value)) // try to not translate dates
            //value = t(this.props, `${this.props.metadataField.name}.${value}`)

        let label = this.props.label || t(this.props, `activerecord.attributes.${underscore(this.props.obj.type)}.${this.props.attribute}`);
        let value = this.props.obj[this.props.attribute] || '---';
        if (typeof value === 'string' && !/\d{2,4}/.test(value)) // try to not translate dates
            value = t(this.props, `${this.props.attribute}.${value}`)
        if (typeof value === 'object' && value !== null)
            value = value[this.props.locale]
        if (typeof value === 'string' && this.state.collapsed) 
            value = value.substring(0,25)

        return (
            <span>
                <span className="flyout-content-label">{label}:</span>
                <span className={"flyout-content-data " + this.props.className}>{value}</span>
            </span>
        )
    }

    render() {
        let edit = admin(this.props, this.props.obj) && this.state.editing
        return (
            <p className={this.props.className} key={`content-field-${this.props.label}-${this.props.value}`}>
                {edit ? this.form() : this.show()}
                {this.toggle()}
                {this.props.children}
                {this.editButton()}
            </p>
        )
    }

}
