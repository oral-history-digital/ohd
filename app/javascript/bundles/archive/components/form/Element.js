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
        return (
            <label htmlFor={`${this.props.scope}_${this.props.attribute}`}>
                {t(this.props, `${this.props.scope}.${this.props.attribute}`) + mandatory}
            </label>
        );
    }

    error() {
        if (!this.props.valid && this.props.showErrors) {
            return (
                <div className='error'>
                    {t(this.props, `${this.props.scope}_errors.${this.props.attribute}`)}
                </div>
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className='form-group'>
                <div className='form-label'>
                    {this.label()}
                    {this.error()}
                </div>
                <div className='form-input'>
                    {this.props.children}
                </div>
            </div>
        );
    }

}
