import { useState, createElement } from 'react';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';
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
    getNewElements,
    elementRepresentation,
    onDeleteCallback,
    replaceNestedFormValues
}) {
    const { t } = useI18n();
    const elements = (parent?.[`${pluralize(scope)}_attributes`] || parent?.[pluralize(scope)] || []);
    const newElements = (getNewElements() || []);
    const [editing, setEditing] = useState(showElementsInForm);
    const cancel = () => setEditing(false);

    const form = createElement(formComponent, {...formProps,
        data: {},
        index: newElements.length,
        nested: true,
        submitData: onSubmit,
        onSubmitCallback: cancel,
        onCancel: cancel,
        formClasses: 'nested-form default',
    })

    const wrapper = wrapperComponent && createElement(wrapperComponent, {
        ...formProps,
        children: [form],
        replaceNestedFormValues: replaceNestedFormValues,
    });

    return (
        <div className={classNames('nested-scope', scope)} >
            <h4>{t(`${pluralize(scope)}.title`)}</h4>
            { Array.isArray(elements) && elements.map( (element, index) => {
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
                )
            })}
            { newElements.map( (element, index) => {
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
                )
            })}
            { editing ?
                (wrapper ? wrapper : form) :
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t(`edit.${scope}.new`)}
                    onClick={() => setEditing(!editing)}
                >
                    {t(`${pluralize(scope)}.add`) + '  '}
                    <FaPlus className="Icon Icon--editorial" />
                </button>
            }
        </div>
    )
}

NestedScope.propTypes = {
    onDeleteCallback: PropTypes.func,
};
