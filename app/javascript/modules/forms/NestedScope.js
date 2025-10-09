import classNames from 'classnames';
import PropTypes from 'prop-types';
import { cloneElement, createElement, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { getData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { pluralize, underscore } from 'modules/strings';
import NestedScopeElementContainer from './NestedScopeElementContainer';

export default function NestedScope({
    onSubmit,
    onDelete,
    formComponent,
    formProps,
    wrapperComponent,
    parent,
    scope,
    showElementsInForm,
    disableAddingElements,
    getNewElements,
    elementRepresentation,
    onDeleteCallback,
    replaceNestedFormValues,
}) {
    const { t } = useI18n();
    const dataState = useSelector(getData);
    // get parent from state to keep it actual
    const parentDataState =
        parent?.type && dataState[pluralize(underscore(parent.type))];
    const actualParent = parentDataState ? parentDataState[parent.id] : parent;
    const elements =
        actualParent?.[`${pluralize(scope)}_attributes`] ||
        actualParent?.[pluralize(scope)] ||
        [];
    const newElements = getNewElements() || [];
    const [editing, setEditing] = useState(showElementsInForm);
    const cancel = () => setEditing(false);

    const form = createElement(formComponent, {
        ...formProps,
        data: {},
        index: newElements.length,
        nested: true,
        submitData: onSubmit,
        onSubmitCallback: cancel,
        onCancel: cancel,
        formClasses: 'nested-form default',
    });
    // Ensure the created form element has a stable key when passed as a child
    const formWithKey = form
        ? cloneElement(form, { key: `nested-form-${newElements.length}` })
        : form;

    const wrapper =
        wrapperComponent &&
        createElement(
            wrapperComponent,
            {
                ...formProps,
                replaceNestedFormValues: replaceNestedFormValues,
            },
            formWithKey
        );

    return (
        <div className={classNames('nested-scope', scope)}>
            <h4>{t(`${pluralize(scope)}.title`)}</h4>
            {Array.isArray(elements) &&
                elements.map((element, index) => {
                    return (
                        <NestedScopeElementContainer
                            key={`nse-${index}`}
                            element={element}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            onDeleteCallback={onDeleteCallback}
                            formComponent={formComponent}
                            formProps={formProps}
                            scope={scope}
                            elementRepresentation={elementRepresentation}
                            showForm={editing}
                        />
                    );
                })}
            {newElements.map((element, index) => {
                return (
                    <NestedScopeElementContainer
                        key={`nnse-${index}`}
                        element={element}
                        index={index}
                        onSubmit={onSubmit}
                        onDelete={onDelete}
                        formComponent={formComponent}
                        formProps={formProps}
                        scope={scope}
                        elementRepresentation={elementRepresentation}
                        showForm={editing}
                    />
                );
            })}
            {disableAddingElements ? null : editing ? (
                wrapper ? (
                    wrapper
                ) : (
                    form
                )
            ) : (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t(`edit.${scope}.new`)}
                    onClick={() => setEditing(!editing)}
                >
                    {t(`${pluralize(scope)}.add`) + '  '}
                    <FaPlus className="Icon Icon--editorial" />
                </button>
            )}
        </div>
    );
}

NestedScope.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    formComponent: PropTypes.elementType.isRequired,
    formProps: PropTypes.object,
    wrapperComponent: PropTypes.elementType,
    parent: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    showElementsInForm: PropTypes.bool,
    disableAddingElements: PropTypes.bool,
    getNewElements: PropTypes.func.isRequired,
    elementRepresentation: PropTypes.func,
    onDeleteCallback: PropTypes.func,
    replaceNestedFormValues: PropTypes.func,
};
