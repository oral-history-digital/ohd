import React from 'react';
import InputContainer from '../../containers/form/InputContainer';
import TextareaContainer from '../../containers/form/TextareaContainer';
import RichTextareaContainer from '../../containers/form/RichTextareaContainer';
import { t } from '../../../../lib/utils';

export default class MultiLocaleWrapper extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    label(locale) {
        let mandatory = this.props.mandatory ? ' *' : '';
        let label = this.props.label ? this.props.label : t(this.props, `activerecord.attributes.${this.props.scope}.${this.props.attribute}`) + mandatory;
        return `${label} (${locale})`;
    }

    findTranslation(locale) {
        let translation;
        if (this.props.data && this.props.data.type === 'Segment') {
            translation = this.props.data.translations && (
                this.props.data.translations.find(t => t.locale === locale) ||
                // in zwar there has not been an inital original version
                this.props.data.translations.find(t => t.locale === `${locale}-public`) 
            )
        } else {
            translation = this.props.data && this.props.data.translations && this.props.data.translations.find(t => t.locale === locale)
        }
        return translation;
    }

    handleChange(name, value, translation) {
        let params = {translation: Object.assign({}, translation, {[name]: value})};
        this.props.handleChange(null, null, params, 'locale');
    }

    preparedProps(locale) {
        return Object.assign({}, this.props, {
            handleChange: this.handleChange,
            data: this.findTranslation(locale) || {locale: locale},
            label: this.label(locale),
            key: `${this.props.attribute}-${locale}`
        })
    }

    components() {
        return {
            input: InputContainer,
            richTextEditor: RichTextareaContainer,
            textarea: TextareaContainer
        }
    }

    render() {
        let _this = this;
        return (
            <div className='multi-locale-input'>
                {this.props.locales.map((locale, index) => {
                    return React.createElement(_this.components()[_this.props.elementType], _this.preparedProps(locale));
                })}
            </div>
        )
    }

}
