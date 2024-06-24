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
    parent,
    scope,
    showElementsInForm,
    getNewElements,
    elementRepresentation,
    onDeleteCallback,
}) {
    const { t } = useI18n();
    const elements = (parent?.[`${pluralize(scope)}_attributes`] || parent?.[pluralize(scope)] || []);
    const newElements = (getNewElements() || []);
    const [editing, setEditing] = useState((newElements.length + elements.length) === 0);

    const cancel = () => setEditing(false);

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
                        showForm={showElementsInForm}
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
                        showForm={showElementsInForm}
                    />
                )
            })}
            { (editing && !showElementsInForm) ?
                createElement(formComponent, {...formProps,
                    data: {},
                    nested: true,
                    submitData: onSubmit,
                    onSubmitCallback: setEditing,
                    onCancel: cancel,
                    formClasses: 'nested-form default',
                }) :
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
