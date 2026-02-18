import { cloneElement, createElement, useState } from 'react';

import classNames from 'classnames';
import { getLocale, getProjectId } from 'modules/archive';
import {
    deleteData,
    getCurrentProject,
    getData,
    submitData,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { pluralize, underscore } from 'modules/strings';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import NestedScopeElement from './NestedScopeElement';

export default function NestedScope({
    onCreateNew,
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
    const dispatch = useDispatch();
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);
    const dataState = useSelector(getData);

    // Get parent from state to keep it updated
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

    /**
     * Create a submit handler for a nested element.
     * Routes to Redux action for existing items (with id) or local state for new items.
     */
    function createSubmitHandler(element) {
        if (element.id) {
            // Existing item - dispatch immediately to server via Redux
            return (params, args) => dispatch(submitData(params, args));
        } else {
            // New item - update local form state, will be sent with parent
            return onCreateNew;
        }
    }

    /**
     * Create a delete handler for a nested element.
     * Routes to Redux action for existing items or local state for new items.
     */
    function createDeleteHandler(element, index) {
        if (typeof element.id !== 'undefined') {
            // Existing item - dispatch delete to server via Redux
            return () => {
                dispatch(
                    deleteData(
                        { locale, projectId, project },
                        pluralize(scope),
                        element.id,
                        null,
                        null,
                        false,
                        false,
                        onDeleteCallback
                    )
                );
            };
        } else {
            // New item - remove from local state
            return () => onDelete(index, scope);
        }
    }

    const form = createElement(formComponent, {
        ...formProps,
        data: {},
        index: newElements.length,
        nested: true,
        submitData: onCreateNew,
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
                        <NestedScopeElement
                            key={`nse-${index}`}
                            element={element}
                            submitHandler={createSubmitHandler(element)}
                            deleteHandler={createDeleteHandler(element, index)}
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
                    <NestedScopeElement
                        key={`nnse-${index}`}
                        element={element}
                        index={index}
                        submitHandler={createSubmitHandler(element)}
                        deleteHandler={createDeleteHandler(element, index)}
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
    onCreateNew: PropTypes.func.isRequired,
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
