import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import NestedScopeElementContainer from './NestedScopeElementContainer';
import { useState, createElement } from 'react';
import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';

export default function NestedScope({
    onSubmit,
    onDelete,
    formComponent,
    formProps,
    parent,
    scope,
    getNewElements,
    elementRepresentation,
}) {
    const { t } = useI18n();
    const elements = (parent?.[pluralize(scope)] || []);//.concat(getNewElements());
    const [editing, setEditing] = useState(elements.length === 0);

    return (
        <>
            { elements.map( element => {
                return (
                    <NestedScopeElementContainer
                        element={element}
                        onSubmit={onSubmit}
                        onDelete={onDelete}
                        formComponent={formComponent}
                        formProps={formProps}
                        scope={scope}
                        elementRepresentation={elementRepresentation}
                    />
                )
            })}
            { (getNewElements() || []).map( (element, index) => {
                return (
                    <NestedScopeElementContainer
                        element={element}
                        index={index}
                        onSubmit={onSubmit}
                        onDelete={onDelete}
                        formComponent={formComponent}
                        formProps={formProps}
                        scope={scope}
                        elementRepresentation={elementRepresentation}
                    />
                )
            })}
            { editing ?
                createElement(formComponent, {...formProps, ...{data: {}, onSubmit: onSubmit, onSubmitCallback: setEditing}}) : null
            }
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                title={t(`edit.${scope}.new`)}
                onClick={() => setEditing(!editing)}
            >
                {t(`${pluralize(scope)}.add`) + '  '}
                {
                    editing ?
                        <FaTimes className="Icon Icon--editorial" /> :
                        <FaPlus className="Icon Icon--editorial" />
                }
            </button>
        </>
    )
                    
}
