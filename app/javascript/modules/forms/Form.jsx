import { createElement, useState } from 'react';

import classNames from 'classnames';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { RegistryTreeSelect } from 'modules/registry-tree-select';
import { CancelButton, SubmitButton } from 'modules/ui/Buttons';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte-18support';

import {
    ColorPicker,
    ErrorMessages,
    Extra,
    InputField,
    MultiLocaleWrapper,
    NestedScope,
    RegistryEntrySelect,
    SelectField,
    SpeakerDesignationInputs,
    Textarea,
} from './components';
import { useFormState } from './hooks/useFormState';

const elementTypeToComponent = {
    colorPicker: ColorPicker,
    input: InputField,
    registryEntrySelect: RegistryEntrySelect,
    registryEntryTreeSelect: RegistryTreeSelect,
    richTextEditor: RichTextEditor,
    select: SelectField,
    speakerDesignationInputs: SpeakerDesignationInputs,
    textarea: Textarea,
    extra: Extra,
};

export default function Form({
    buttonFullWidth = false,
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

    const {
        values,
        errors,
        updateField,
        handleErrors,
        valid,
        writeNestedObject,
        deleteNestedObject,
        getNestedObjects,
        replaceNestedFormValues,
    } = useFormState(initialValues, data, elements);

    const { t } = useI18n();

    function handleChange(name, value, params, identifier) {
        if (params && !name && !value) {
            writeNestedObject(params, identifier);
        } else {
            updateField(name, value);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (valid()) {
            onSubmit({ [scope || submitScope]: values }, index);
            if (typeof onSubmitCallback === 'function') {
                onSubmitCallback();
            }
        } else {
            setSubmitted(true);
        }
    }

    // Props is a dummy here
    function handleNestedFormSubmit(_, params, index) {
        writeNestedObject(params, null, index);
    }

    function nestedScopes() {
        return nestedScopeProps?.map((props) => (
            <NestedScope
                key={props.scope}
                {...props}
                onSubmit={handleNestedFormSubmit}
                onDelete={deleteNestedObject}
                getNewElements={() => getNestedObjects(props.scope)}
                replaceNestedFormValues={replaceNestedFormValues}
            />
        ));
    }

    function elementComponent(element) {
        const preparedProps = { ...element };
        preparedProps.scope = element.scope || scope;
        preparedProps.showErrors = errors[element.attribute];
        preparedProps.handleChange = handleChange;
        preparedProps.handleErrors = handleErrors;
        preparedProps.key = element.attribute;
        preparedProps.value =
            values[element.attribute] !== undefined
                ? values[element.attribute]
                : element.value;
        preparedProps.data = data;
        preparedProps.accept = element.accept;

        // Set defaults for the possibility to shorten elements list
        if (!element.elementType) {
            preparedProps.elementType = 'input';
            preparedProps.type = 'text';
        }

        if (preparedProps.multiLocale) {
            return createElement(MultiLocaleWrapper, preparedProps);
        } else {
            return createElement(
                elementTypeToComponent[preparedProps.elementType],
                preparedProps
            );
        }
    }

    return (
        <div
            className={classNames(className, 'LoadingOverlay', {
                'is-loading': fetching,
            })}
        >
            {helpTextCode && <HelpText code={helpTextCode} className="u-mb" />}

            {nestedScopes()}
            <form
                id={formId || scope}
                className={classNames('Form', formClasses, {
                    [`${scope} default`]: !formClasses,
                })}
                onSubmit={handleSubmit}
            >
                {children}

                {elements.map((element) => {
                    if (
                        element.condition === undefined ||
                        element.condition === true
                    ) {
                        return elementComponent(element);
                    }
                })}

                {submitted && (
                    <ErrorMessages
                        errors={errors}
                        elements={elements}
                        scope={scope}
                    />
                )}

                <div
                    className={classNames('Form-footer', 'u-mt', {
                        'Form-footer--fullWidth': buttonFullWidth,
                    })}
                >
                    {typeof onCancel === 'function' && (
                        <CancelButton
                            buttonText={t(nested ? 'discard' : 'cancel')}
                            handleCancel={onCancel}
                            isLoading={fetching}
                            isDisabled={fetching}
                            size={nested ? 'sm' : undefined}
                        />
                    )}
                    <SubmitButton
                        buttonText={t(
                            submitText || (nested ? 'apply' : 'submit')
                        )}
                        isLoading={fetching}
                        isDisabled={fetching}
                        size={nested ? 'sm' : undefined}
                    />
                </div>
            </form>
        </div>
    );
}

Form.propTypes = {
    buttonFullWidth: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    className: PropTypes.string,
    data: PropTypes.object,
    elements: PropTypes.arrayOf(
        PropTypes.shape({
            attribute: PropTypes.string,
            value: PropTypes.any,
            accept: PropTypes.string,
            condition: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            elementType: PropTypes.string,
            hidden: PropTypes.bool,
            optional: PropTypes.bool,
            multiLocale: PropTypes.bool,
            validate: PropTypes.func,
            scope: PropTypes.string,
        })
    ).isRequired,
    fetching: PropTypes.bool,
    formClasses: PropTypes.string,
    formId: PropTypes.string,
    helpTextCode: PropTypes.string,
    index: PropTypes.number,
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
