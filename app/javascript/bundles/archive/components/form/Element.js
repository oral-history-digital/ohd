import React from 'react';
import Label from './Label';
import { t } from 'lib/utils';

export default class Element extends React.Component {

    // props are:
    //   @scope
    //   @attribute
    //   @valid = boolean
    //   @mandatory = boolean

    error() {
        if (!this.props.valid && this.props.showErrors) {
            let msg = this.props.individualErrorMsg ?
                t(this.props, `activerecord.errors.models.${this.props.scope}.attributes.${this.props.attribute}.${this.props.individualErrorMsg}`) :
                t(this.props, `activerecord.errors.default.${this.props.elementType}`)
            return (
                <div className='help-block'>
                    {msg}
                </div>
            )
        } else {
            return null;
        }
    }

    css() {
        let name = `form-group ${this.props.css ? this.props.css : ''} ${this.props.hidden ? 'hidden' : ''}`;
        if (!this.props.valid && this.props.showErrors) {
            name += ' has-error';
        }
        return name;
    }

    render() {
        const { label, labelKey, scope, attribute, help } = this.props;

        const hasLabel = typeof label === 'undefined';
        // Scope is equivalent to model here.
        const key = labelKey || `activerecord.attributes.${scope}.${attribute}`;

        return (
            <div className={this.css()}>
                <Label
                    label={hasLabel ? label : undefined}
                    labelKey={key}
                    mandatory={this.props.mandatory}
                    htmlFor={this.props.htmlFor}
                />

                <div className='form-input'>
                    {this.props.children}
                    <p className='help-block'>
                        {typeof(help) === 'string' ? t(this.props, help) : help}
                    </p>
                </div>

                {this.error()}
            </div>
        );
    }

}
