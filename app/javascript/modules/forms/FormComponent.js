import { createElement, useState } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte-17';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import { RegistryTreeSelect } from 'modules/registry-tree-select';
import { HelpText } from 'modules/help-text';
import { pluralize } from 'modules/strings';
import InputContainer from './input-components/InputContainer';
import Textarea from './input-components/Textarea';
import SelectContainer from './input-components/SelectContainer';
import ColorPicker from './input-components/ColorPicker';
import Extra from './input-components/Extra';
import RegistryEntrySelectContainer from './input-components/RegistryEntrySelectContainer';
import SpeakerDesignationInputs from './input-components/SpeakerDesignationInputs';
import NestedScope from './NestedScope';
import MultiLocaleWrapperContainer from './MultiLocaleWrapperContainer';
import ErrorMessages from './ErrorMessages';

const elementTypeToComponent = {
    colorPicker: ColorPicker,
    input: InputContainer,
    registryEntrySelect: RegistryEntrySelectContainer,
    registryEntryTreeSelect: RegistryTreeSelect,
    richTextEditor: RichTextEditor,
    select: SelectContainer,
    speakerDesignationInputs: SpeakerDesignationInputs,
    textarea: Textarea,
    extra: Extra,
};

export default function FormComponent({
    children,
    className,
    data,
    elements,
    fetching,
    formClasses,
    formId,
    helpTextCode,
    index,
    nested,
    nestedScopeProps,
    onCancel,
    onSubmit,
    onSubmitCallback,
    scope,
    submitScope,
    submitText,
    values: initialValues,
}) {
    const [submitted, setSubmitted] = useState(false);

    const [values, setValues] = useState(initValues());
    const [errors, setErrors] = useState(initErrors());

    const { t } = useI18n();

    function initValues() {
        const values = { ...initialValues };
        if (data) {
            values.id = data.type === 'Interview' ? data.archive_id : data.id;
        }
        return values;
    }

    function initErrors() {
        let errors = {};
        elements.map((element) => {
            let error = false;
            if (typeof(element.validate) === 'function') {
                let value = element.value || (values[element.attribute]);
                error = !(value && element.validate(value));
            }
            if (element.attribute) errors[element.attribute] = error;
        })
        return errors;
    }

    function handleErrors(name, hasError) {
        if (name !== 'undefined') {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: hasError
            }));
        }
    }

    function handleChange(name, value, params, identifier) {
        if (params && !name && !value) {
            writeNestedObjectToStateValues(params, identifier);
        } else {
            setValues(prevValues => ({
                ...prevValues,
                [name]: value
            }));
        }
    }

    function valid() {
        let hasErrors = false;

        Object.keys(errors).forEach(name => {
            if (name !== 'undefined') {
                const element = elements.find(element => element.attribute === name);

                const isHidden = element?.hidden;
                const isOptional = element?.optional;

                hasErrors = hasErrors || (!isHidden && !isOptional && errors[name]);
            }
        })

        return !hasErrors;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if(valid()) {
            onSubmit({[scope || submitScope]: values}, index);
            if (typeof onSubmitCallback === "function") {
                onSubmitCallback();
            }
        } else {
            setSubmitted(true);
        }
    }

    function deleteNestedObject(index, scope) {
        let nestedObjects = values[nestedRailsScopeName(scope)];

        setValues(prevValues => ({
            ...prevValues,
            [nestedRailsScopeName(scope)]: nestedObjects.slice(0, index).concat(nestedObjects.slice(index + 1))
        }));
    }

    function nestedRailsScopeName(scope) {
        return `${pluralize(scope)}_attributes`;
    }

    function writeNestedObjectToStateValues(params, identifier, index) {
        // for translations identifier is 'locale' to not multiply translations
        identifier ||= 'id';
        let scope = Object.keys(params)[0];
        let nestedObject = params[scope];
        let nestedObjects = values[nestedRailsScopeName(scope)] || [];
        if (index === undefined)
            index = nestedObjects.findIndex((t) => nestedObject[identifier] && t[identifier] === nestedObject[identifier]);
        index = index === -1 ? nestedObjects.length : index;

        setValues(prevValues => ({
            ...prevValues,
            [nestedRailsScopeName(scope)]: Object.assign([], nestedObjects, {
                [index]: Object.assign({}, nestedObjects[index], nestedObject)
            })
        }));
    }

    // props is a dummy here
    function handleNestedFormSubmit(props, params, index) {
        writeNestedObjectToStateValues(params, null, index);
    }

    function nestedScopes() {
        return nestedScopeProps?.map(props => (
            <NestedScope key={props.scope} {...props}
                onSubmit={handleNestedFormSubmit}
                onDelete={deleteNestedObject}
                getNewElements={() => values[nestedRailsScopeName(props.scope)]}
            />
        ))
    }

    function elementComponent(props) {
        const preparedProps = {...props};
        preparedProps.scope = props.scope || scope;
        preparedProps.showErrors = errors[props.attribute];
        preparedProps.handleChange = handleChange;
        preparedProps.handleErrors = handleErrors;
        preparedProps.key = props.attribute;
        preparedProps.value = values[props.attribute] !== undefined ?
            values[props.attribute] :
            props.value;
        preparedProps.data = data;

        // set defaults for the possibility to shorten elements list
        if (!props.elementType) {
            preparedProps.elementType = 'input';
            preparedProps.type = 'text';
        }

        if (preparedProps.multiLocale) {
            return createElement(MultiLocaleWrapperContainer, preparedProps);
        } else {
            return createElement(elementTypeToComponent[preparedProps.elementType], preparedProps);
        }
    }

    return (
        <div className={classNames(className, 'LoadingOverlay', {
            'is-loading': fetching
        })}>
            {nestedScopes()}
            <form
                id={formId || scope}
                className={classNames('Form', formClasses, {
                    [`${scope} default`]: !formClasses,
                })}
                onSubmit={handleSubmit}
            >
                {helpTextCode && <HelpText code={helpTextCode} className="u-mb" />}

                {children}

                {elements.map(props => {
                    if (props.condition === undefined || props.condition === true) {
                        return elementComponent(props);
                    }
                })}

                { submitted && <ErrorMessages errors={errors} elements={elements} scope={scope} />}

                <div className="Form-footer u-mt">
                    { nested ?
                        <button
                            type="submit"
                            className="Button Button--transparent Button--icon"
                            value={t(submitText || 'submit')}
                        >
                            <FaCheckCircle className="Icon Icon--editorial" />
                        </button> :
                        <input
                            type="submit"
                            className="Button Button--primaryAction"
                            disabled={fetching}
                            value={t(submitText || 'submit')}
                        />
                    }
                    {typeof onCancel === 'function' && (
                        nested ?
                            <button
                                className="Button Button--transparent Button--icon"
                                title={t('edit.default.cancel')}
                                onClick={onCancel}
                            >
                                <FaTimes className="Icon Icon--editorial" />
                            </button> :
                            <input
                                type="button"
                                className="Button Button--secondaryAction"
                                disabled={fetching}
                                value={t('cancel')}
                                onClick={onCancel}
                            />
                    )}
                </div>
            </form>
        </div>
    );
}

FormComponent.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    className: PropTypes.string,
    data: PropTypes.object,
    elements: PropTypes.array.isRequired,
    fetching: PropTypes.bool,
    formClasses: PropTypes.string,
    formId: PropTypes.string,
    helpTextCode: PropTypes.string,
    index: PropTypes.number,
    locale: PropTypes.string,
    nested: PropTypes.bool,
    nestedScopeProps: PropTypes.array,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitCallback: PropTypes.func,
    scope: PropTypes.string,
    submitScope: PropTypes.string,
    submitText: PropTypes.string,
    values: PropTypes.object,
};
