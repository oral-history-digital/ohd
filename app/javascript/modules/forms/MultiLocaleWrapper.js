import { createElement, Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import RichTextareaContainer from './input-components/RichTextareaContainer';
import InputContainer from './input-components/InputContainer';
import Textarea from './input-components/Textarea';

export default class MultiLocaleWrapper extends Component {

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
        const { data } = this.props;

        if (!data?.translations_attributes) {
            return null;
        }

        const translationsArray = Array.isArray(data.translations_attributes) ? data.translations_attributes :
            Object.values(data.translations_attributes);
        const originalTranslation = translationsArray.find(t => t.locale === locale);
        const publicTranslation = translationsArray.find(t => t.locale === `${locale}-public`);

        if (data.type !== 'Segment') {
            return originalTranslation;
        }

        // From here only for segments.
        let translation;
        if (originalTranslation) {
            // Make clone because it will get mutated.
            translation = {
                ...originalTranslation,
            };

            // Copy over values from xx-public to xx if values in xx are empty.
            if (!translation.text || translation.text === '') {
                translation.text = publicTranslation?.text;
            }
            if (!translation.mainheading || translation.mainheading === '') {
                translation.mainheading = publicTranslation?.mainheading;
            }
            if (!translation.subheading || translation.subheading === '') {
                translation.subheading = publicTranslation?.subheading;
            }

        } else {
            // in zwar there has not been an initial original version
            translation = publicTranslation;
        }
        return translation;
    }

    handleChange(name, value, translation) {
        let params = {translation: {[name]: value, locale: translation.locale, id: translation.id}};
        this.props.handleChange(null, null, params, 'locale');
    }

    preparedProps(locale) {
        const translation = this.findTranslation(locale) || {locale: locale};
        const value = translation[this.props.attribute];

        return Object.assign({}, this.props, {
            handleChange: this.handleChange,
            data: translation,
            value: value,
            label: this.label(locale),
            key: `${this.props.attribute}-${locale}`
        })
    }

    components() {
        return {
            input: InputContainer,
            richTextEditor: RichTextareaContainer,
            textarea: Textarea,
        }
    }

    render() {
        return (
            <div className='multi-locale-input'>
                {this.props.locales.map(locale => {
                    return createElement(this.components()[this.props.elementType], this.preparedProps(locale));
                })}
            </div>
        );
    }
}

MultiLocaleWrapper.propTypes = {
    data: PropTypes.object,
};
