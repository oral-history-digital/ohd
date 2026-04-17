import { createElement, useRef } from 'react';

import { ALPHA2_TO_ALPHA3 } from 'modules/constants';
import { getProjectLocales } from 'modules/data';
import { getMergedTranslations } from 'modules/forms/utils';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { InputField, RichTextarea, Textarea } from '../input';

export default function MultiLocaleWrapper(props) {
    const { t } = useI18n();
    const locales = useSelector(getProjectLocales);

    const {
        attribute,
        elementType,
        scope,
        label,
        mandatory,
        data, // Persisted data
        formValues, // Current form values which may include unsaved changes
        handleChange,
        handleErrors,
        validate,
        origAsLocale,
    } = props;

    const localEditedValuesRef = useRef({});
    const usedLocales = origAsLocale ? [...locales, 'orig'] : locales;

    const usedLocale = (locale) => {
        const alpha3 = ALPHA2_TO_ALPHA3[locale];
        return data?.type === 'Segment' ? alpha3 : locale;
    };

    const labelFunc = (locale) => {
        return (
            (label || t(`activerecord.attributes.${scope}.${attribute}`)) +
            (mandatory ? ' *' : '') +
            ` (${usedLocale(locale)})`
        );
    };

    const findTranslation = (locale) => {
        const translationsArray = getMergedTranslations(data, formValues);

        if (translationsArray.length === 0) {
            return null;
        }

        const originalTranslation = translationsArray.find(
            (t) => t.locale === locale
        );
        const publicTranslation = translationsArray.find(
            (t) => t.locale === `${locale}-public`
        );

        if (data?.type !== 'Segment') {
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
    };

    const getLiveTranslationValue = (localeKey) => {
        // Prefer just-typed values because parent form state updates asynchronously.
        if (
            Object.prototype.hasOwnProperty.call(
                localEditedValuesRef.current,
                localeKey
            )
        ) {
            return localEditedValuesRef.current[localeKey];
        }

        return findTranslation(localeKey)?.[attribute];
    };

    const updateMultiLocaleErrorState = () => {
        if (
            typeof validate !== 'function' ||
            typeof handleErrors !== 'function'
        ) {
            return;
        }

        // Multi-locale fields are valid when at least one locale passes validation.
        const hasAnyValidTranslation = usedLocales.some((locale) =>
            validate(getLiveTranslationValue(usedLocale(locale)))
        );

        handleErrors(attribute, !hasAnyValidTranslation);
    };

    const onChange = (name, value, translation) => {
        localEditedValuesRef.current[translation.locale] = value;

        let params = {
            translation: {
                [name]: value,
                locale: translation.locale,
                id: translation.id,
            },
        };
        handleChange(null, null, params, 'locale');

        updateMultiLocaleErrorState();
    };

    const preparedProps = (locale) => {
        const translation = findTranslation(usedLocale(locale)) || {
            locale: usedLocale(locale),
        };
        const value = translation[attribute];

        return Object.assign({}, props, {
            handleChange: onChange,
            data: translation,
            value: value,
            label: labelFunc(locale),
            key: `${attribute}-${locale}`,
            id: `${attribute}_${locale}`,
        });
    };

    const components = {
        input: InputField,
        richTextEditor: RichTextarea,
        textarea: Textarea,
    };

    return (
        <div className="multi-locale-input">
            {usedLocales.map((locale) => {
                return createElement(
                    components[elementType],
                    preparedProps(locale)
                );
            })}
        </div>
    );
}

MultiLocaleWrapper.propTypes = {
    attribute: PropTypes.string,
    elementType: PropTypes.string,
    scope: PropTypes.string,
    label: PropTypes.string,
    mandatory: PropTypes.bool,
    data: PropTypes.object,
    formValues: PropTypes.object,
    handleChange: PropTypes.func,
    handleErrors: PropTypes.func,
    validate: PropTypes.func,
    origAsLocale: PropTypes.bool,
    value: PropTypes.any,
    accept: PropTypes.string,
    condition: PropTypes.bool,
};
