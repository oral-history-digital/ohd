import { useState, useEffect } from 'react';

import { useI18n } from 'modules/i18n';
import Element from '../Element';

export default function Select({
    scope,
    attribute,
    value,
    values,
    keepOrder,
    data,
    validate,
    label,
    labelKey,
    showErrors,
    handleChange,
    handlechangecallback,
    handleErrors,
    help,
    individualErrorMsg,
    hidden,
    className,
    doNotTranslate,
    optionsScope,
    withEmpty,
    id,
}) {
    const defaultValue = value || data?.[attribute];
    const { t, locale } = useI18n();

    const onChange = (event) => {
        const newValue =  event.target.value;
        const name =  event.target.name;

        handleChange(name, newValue, data);

        if (typeof handlechangecallback === 'function') {
            handlechangecallback(name, newValue);
        }

        if (typeof validate === 'function') {
            const valid = validate(newValue);
            handleErrors(name, !valid);
        }
    }

    //useEffect(() => {
        //if (typeof(validate) === 'function') {
            //const valid = validate(defaultValue);
            //handleErrors(attribute, !valid);
        //}
        //handleChange(attribute, defaultValue, data);
    //}, [defaultValue]);

    const selectTextAndValueFunction = (value) => {

        if (typeof value === 'string') {
            let translationPrefix = optionsScope || `${scope}.${attribute}`;
            return function(value) {
                return {
                    text: doNotTranslate ? value : t(`${translationPrefix}.${value}`),
                    value: value
                }
            }
        } else {
            return function(value) {
                return {
                    text: (value.name && value.name[locale]) || (typeof value.name === 'string') && value.name,
                    value: value.value || value.id
                }
            }
        }
    }

    const options = () => {
        let opts = [];
        let rawOpts;

        if (values) {
            if (Array.isArray(values)) {
                rawOpts = values;
            } else {
                rawOpts = Object.keys(values).map((id, i) => {
                    return {id: id, name: values[id].name}
                })
            }
        } else if (data && attribute === 'workflow_state') {
            rawOpts = data.workflow_states;
        }

        if (rawOpts) {
            let getTextAndValue = selectTextAndValueFunction(rawOpts[0]);
            if (!!keepOrder) {
                rawOpts.
                sort((a,b) => {
                  let textA = getTextAndValue(a).text;
                  let textB = getTextAndValue(b).text;
                  return (new Intl.Collator(locale).compare(textA, textB))
             })
           }

            opts = rawOpts.
                map((value, index) => {
                    if (value) {
                        let textAndValue = getTextAndValue(value);
                        return (
                            <option value={textAndValue.value} key={`${scope}-${index}`}>
                                {textAndValue.text}
                            </option>
                        )
                    }
                }
            )
        }

        if (withEmpty) {
            opts.unshift(
                <option value='' key={`${scope}-choose`}>
                    {t('choose')}
                </option>
            )
        }
        return opts;
    }

    return (
        <Element
            scope={scope}
            attribute={attribute}
            label={label}
            labelKey={labelKey}
            showErrors={showErrors}
            className={className}
            hidden={hidden}
            valid={typeof validate === 'function' ? validate(defaultValue) : true}
            mandatory={typeof(validate) === 'function'}
            elementType='select'
            individualErrorMsg={individualErrorMsg}
            help={help}
        >
            <select
                id={`${scope}_${id ? id : attribute}`}
                name={attribute}
                className="Input"
                defaultValue={defaultValue}
                onChange={onChange}
                handlechangecallback={handlechangecallback}
            >
                {options()}
            </select>
        </Element>
    );
}
