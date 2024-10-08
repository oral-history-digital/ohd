import { createElement } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import RichTextareaContainer from './input-components/RichTextareaContainer';
import InputContainer from './input-components/InputContainer';
import Textarea from './input-components/Textarea';
import { ALPHA2_TO_ALPHA3 } from 'modules/constants';

export default function MultiLocaleWrapper(props) {
    const { t, locale } = useI18n();

    const {
        attribute,
        elementType,
        scope,
        label,
        mandatory,
        data,
        locales,
        handleChange,
    } = props;

    const labelFunc = (locale) => {
        return (label || t(`activerecord.attributes.${scope}.${attribute}`)) +
            (mandatory ? ' *' : '') + ` (${locale})`;
    }

    const findTranslation = (locale) => {
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

    const onChange = (name, value, translation) => {
        let params = {translation: {[name]: value, locale: translation.locale, id: translation.id}};
        handleChange(null, null, params, 'locale');
    }

    const preparedProps = (locale) => {
        const alpha3 = ALPHA2_TO_ALPHA3[locale];
        const usedLocale = data.type === 'Segment' ? alpha3 : locale;

        const translation = findTranslation(usedLocale) || {locale: usedLocale};
        const value = translation[attribute];

        return Object.assign({}, props, {
            handleChange: onChange,
            data: translation,
            value: value,
            label: labelFunc(locale),
            key: `${attribute}-${locale}`
        })
    }

    const components = {
        input: InputContainer,
        richTextEditor: RichTextareaContainer,
        textarea: Textarea,
    }

    return (
        <div className='multi-locale-input'>
            {locales.map(locale => {
                return createElement(components[elementType], preparedProps(locale));
            })}
        </div>
    );
}

MultiLocaleWrapper.propTypes = {
    data: PropTypes.object,
};
