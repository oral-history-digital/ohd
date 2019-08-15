import React from 'react';
import InputContainer from '../../containers/form/InputContainer';
import { t } from '../../../../lib/utils';

export default class MultiLocaleInput extends React.Component {

    label(locale) {
        let mandatory = this.props.mandatory ? ' *' : '';
        let label = this.props.label ? this.props.label : t(this.props, `activerecord.attributes.${this.props.scope}.${this.props.attribute}`) + mandatory;
        return `${label} (${locale})`;
    }

    input(locale) {
        let props = Object.assign({}, this.props, {
            attribute: `[${this.props.attribute}]${locale}`,
            value: this.props.data && this.props.data[this.props.attribute] && this.props.data[this.props.attribute][locale],
            label: this.label(locale),
            key: `${this.props.attribute}-${locale}`
        })
        return React.createElement(InputContainer, props);
    }

    render() {
        return (
            <div className='multi-locale-input'>
                {this.props.locales.map((locale, index) => {
                    return this.input(locale)
                })}
            </div>
        )
    }

}
