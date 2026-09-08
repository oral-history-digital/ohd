import { createElement, useState } from 'react';

import classNames from 'classnames';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { RegistryTreeSelect } from 'modules/registry-tree-select';
import {
    CancelButton,
    ConfirmationModal,
    InlineNotification,
    SubmitButton,
} from 'modules/ui';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte-18support';

import {
    ColorPicker,
    ErrorMessages,
    Extra,
    FileInputFormElement,
    FormRow,
    InputField,
    MultiLocaleWrapper,
    NestedScope,
    RegistryEntrySelect,
    SelectField,
    SpeakerDesignationInputs,
    Textarea,
} from './components';
import { useFormState } from './hooks';
import { organizeElementsByGroup } from './utils';

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
    fileInput: FileInputFormElement,
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
    hasValidationErrors = false,
    helpTextCode,
    index,
    nested,
    nestedScopeProps,
    notification,
    onCancel,
    onChange,
    onDismissNotification,
    onSubmit,
    onSubmitCallback,
    disableIfUnchanged = false,
    scope,
    submitScope,
    submitText,
    submitConfirmation,
    cancelText,
    values: initialValues,
}) {
    const [submitted, setSubmitted] = useState(false);
    // Keep validated params stable while the user decides whether to submit.
    // Cancelling drops these params without changing the form's dirty baseline.
    const [pendingSubmission, setPendingSubmission] = useState(null);
    const baseFormIdentifier = formId || scope || submitScope || 'form';
    const formIdentifier =
        typeof index === 'number'
            ? `${baseFormIdentifier}-${index}`
            : baseFormIdentifier;

    const {
        values,
        initialFormValues,
        errors,
        touched,
        updateField,
        handleErrors,
        touchField,
        touchAllFields,
        valid,
        writeNestedObject,
        deleteNestedObject,
        getNestedObjects,
        replaceNestedFormValues,
        markCurrentValuesAsClean,
        getDirtyStateForValues,
        submitButtonState,
        dirtyFields,
    } = useFormState(initialValues, data, elements, {
        fetching,
        hasValidationErrors,
        submitted,
        disableIfUnchanged,
    });

    const { t } = useI18n();

    function handleChange(name, value, params, identifier) {
        if (params && !name && !value) {
            writeNestedObject(params, identifier);

            if (typeof onChange === 'function') {
                onChange({
                    field: identifier || 'nested',
                    value: params,
                    isDirty: true,
                    dirtyFields: [identifier || 'nested'],
                });
            }

            return;
        } else {
            const nextValues = {
                ...values,
                [name]: value,
            };
            const nextDirtyState = getDirtyStateForValues(nextValues);

            updateField(name, value);
            touchField(name);

            if (typeof onChange === 'function') {
                onChange({
                    field: name,
                    value,
                    isDirty: nextDirtyState.isDirty,
                    dirtyFields: nextDirtyState.dirtyFields,
                });
            }

            return;
        }
    }

    function finishSuccessfulSubmit() {
        // Clear selected local files after a successful submission so file inputs
        // display the persisted files returned by the parent.
        const savedValues = { ...values };

        elements
            .filter((element) => element.elementType === 'fileInput')
            .forEach((element) => {
                savedValues[element.attribute] = null;
                updateField(element.attribute, null);
            });

        markCurrentValuesAsClean(savedValues);
        setSubmitted(false);
        if (typeof onSubmitCallback === 'function') {
            onSubmitCallback();
        }
    }

    function performSubmit(params) {
        // Confirmed and non-confirmed submissions share this path so successful
        // saves always run the same completion and clean-state logic.
        const result = onSubmit(params, index);

        // Promise-based submissions complete after the request resolves. Synchronous
        // nested forms must complete immediately to preserve their callback timing.
        if (result && typeof result.then === 'function') {
            // Asynchronous submission returns a Promise with a .then method
            return result
                .then((response) => {
                    finishSuccessfulSubmit();
                    setPendingSubmission(null);
                    return response;
                })
                .catch(() => {
                    // The parent handles submission errors and notifications.
                });
        } else {
            // Preserve synchronous completion for nested forms.
            finishSuccessfulSubmit();
            setPendingSubmission(null);
            return result;
        }
    }

    function cancelPendingSubmission() {
        // Cancellation closes the modal without marking current edits as saved.
        setPendingSubmission(null);
    }

    function handleSubmit(event) {
        event.preventDefault();
        touchAllFields();

        if (!valid()) {
            setSubmitted(true);
            return;
        }

        const params = { [scope || submitScope]: values };
        // A predicate lets callers limit confirmation to high-impact changes.
        // Without one, every valid submission requires confirmation.
        const requiresConfirmation =
            submitConfirmation &&
            (typeof submitConfirmation.when !== 'function' ||
                submitConfirmation.when({
                    values,
                    initialValues: initialFormValues,
                    dirtyFields,
                }));

        if (requiresConfirmation) {
            setPendingSubmission(params);
            return;
        }

        return performSubmit(params);
    }

    const organizedElements = organizeElementsByGroup(elements);

    // Props is a dummy here
    function handleNestedFormSubmit(_, params, index) {
        writeNestedObject(params, null, index);
    }

    function nestedScopes() {
        return nestedScopeProps?.map((props) => (
            <NestedScope
                key={props.scope}
                {...props}
                onCreateNew={handleNestedFormSubmit}
                onDelete={deleteNestedObject}
                getNewElements={() => getNestedObjects(props.scope)}
                replaceNestedFormValues={replaceNestedFormValues}
            />
        ));
    }

    function elementComponent(element) {
        const preparedProps = { ...element };
        preparedProps.scope = element.scope || scope;
        preparedProps.showErrors =
            (touched[element.attribute] || submitted) &&
            errors[element.attribute];
        preparedProps.handleChange = handleChange;
        preparedProps.handleErrors = handleErrors;
        preparedProps.touchField = touchField;
        preparedProps.key = element.attribute;
        preparedProps.value =
            values[element.attribute] !== undefined
                ? values[element.attribute]
                : element.value;
        preparedProps.data = data;
        preparedProps.formValues = values;
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
            data-testid={`${formIdentifier}-form-wrapper`}
        >
            {helpTextCode && <HelpText code={helpTextCode} className="u-mb" />}

            {nestedScopes()}
            <form
                id={formIdentifier}
                className={classNames('Form', formClasses, {
                    [`${scope} default`]: !formClasses,
                })}
                onSubmit={handleSubmit}
                data-testid={`${formIdentifier}-form`}
            >
                {children}

                {organizedElements.map((item) => (
                    <FormRow
                        key={`group-${item.group}`}
                        group={item.group}
                        elements={item.elements}
                        renderElement={elementComponent}
                    />
                ))}

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
                    <div className="Form-footer-buttons">
                        {typeof onCancel === 'function' && (
                            <CancelButton
                                buttonText={t(
                                    cancelText ||
                                        (nested ? 'discard' : 'cancel')
                                )}
                                handleCancel={onCancel}
                                isDisabled={fetching}
                                size={nested ? 'sm' : undefined}
                            />
                        )}
                        <SubmitButton
                            buttonText={t(
                                submitText || (nested ? 'apply' : 'submit')
                            )}
                            isLoading={fetching}
                            isDisabled={submitButtonState.disabled}
                            title={submitButtonState.helpText}
                            size={nested ? 'sm' : undefined}
                        />
                    </div>
                    {!fetching && submitButtonState.helpText && (
                        <div
                            className="Form-footer-hint-container"
                            style={{ textAlign: 'right' }}
                        >
                            <small
                                className={classNames('Form-footer-hint', {
                                    'Form-footer-hint--error':
                                        hasValidationErrors ||
                                        (submitted && !valid()),
                                })}
                            >
                                {submitButtonState.helpText}
                            </small>
                        </div>
                    )}
                    {notification && (
                        <div className="Form-footer-notification">
                            <InlineNotification
                                variant={notification.variant || 'info'}
                                title={notification.title}
                                description={notification.description}
                                additionalInfo={notification.additionalInfo}
                                isClosable={notification.isClosable !== false}
                                onClose={onDismissNotification}
                                autoHideDuration={
                                    notification.variant === 'success'
                                        ? (notification.autoHideDuration ??
                                          5000)
                                        : notification.autoHideDuration
                                }
                                onAutoHide={onDismissNotification}
                                actions={notification.actions}
                            />
                        </div>
                    )}
                </div>
            </form>
            {submitConfirmation && (
                <ConfirmationModal
                    isOpen={Boolean(pendingSubmission)}
                    title={submitConfirmation.title}
                    message={submitConfirmation.message}
                    confirmText={submitConfirmation.confirmText}
                    cancelText={submitConfirmation.cancelText}
                    confirmColor={submitConfirmation.confirmColor}
                    className={submitConfirmation.className}
                    isLoading={fetching}
                    onCancel={cancelPendingSubmission}
                    onConfirm={() => performSubmit(pendingSubmission)}
                />
            )}
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
            group: PropTypes.string,
        })
    ).isRequired,
    fetching: PropTypes.bool,
    formClasses: PropTypes.string,
    formId: PropTypes.string,
    hasValidationErrors: PropTypes.bool,
    helpTextCode: PropTypes.string,
    index: PropTypes.number,
    nested: PropTypes.bool,
    nestedScopeProps: PropTypes.array,
    notification: PropTypes.shape({
        variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
        title: PropTypes.string,
        description: PropTypes.string,
        additionalInfo: PropTypes.node,
        isClosable: PropTypes.bool,
        autoHideDuration: PropTypes.number,
        actions: PropTypes.object,
    }),
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    onDismissNotification: PropTypes.func,
    onSubmit: PropTypes.func,
    onSubmitCallback: PropTypes.func,
    disableIfUnchanged: PropTypes.bool,
    scope: PropTypes.string,
    submitScope: PropTypes.string,
    submitText: PropTypes.string,
    submitConfirmation: PropTypes.shape({
        title: PropTypes.node.isRequired,
        message: PropTypes.node.isRequired,
        confirmText: PropTypes.node,
        cancelText: PropTypes.string,
        confirmColor: PropTypes.oneOf([
            'primary',
            'secondary',
            'error',
            'success',
        ]),
        className: PropTypes.string,
        when: PropTypes.func,
    }),
    cancelText: PropTypes.string,
    values: PropTypes.object,
};
