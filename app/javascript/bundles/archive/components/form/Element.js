import React from 'react';
import { t } from '../../../../lib/utils';

export default class Element extends React.Component {

    // props are:
    //   @scope
    //   @attribute
    //   @valid = boolean
    //   @mandatory = boolean

    label() {
        let mandatory = this.props.mandatory ? ' *' : '';
        // scope is equivalent to model here
        return (
            <label htmlFor={`${this.props.scope}_${this.props.attribute}`}>
                {t(this.props, this.props.label ? this.props.label : `activerecord.attributes.${this.props.scope}.${this.props.attribute}`) + mandatory}
            </label>
        );
    }

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
        return (
            <div className={this.css()}>
                <div className='form-label'>
                    {this.label()}
                </div>
                <div className='form-input'>
                    {this.props.children}
                </div>
                {this.error()}
            </div>
        );
    }

}
