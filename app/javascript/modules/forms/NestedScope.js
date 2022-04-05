import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import NestedScopeElement from './NestedScopeElement';
import { useState } from 'react';
import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';

export default function NestedScope({
    onSubmit,
    formComponent,
    formProps,
    parent,
    scope,
    newElements,
    elementRepresentation,
}) {
    const { t } = useI18n();
    const elements = (parent?.[pluralize(scope)] || []).concat(newElements);
    const [editing, setEditing] = useState(elements.length === 0);

    return (
        <>
            { elements.map( element => {
                return (
                    <NestedScopeElement
                        element={element}
                        onSubmit={onSubmit}
                        formComponent={formComponent}
                        formProps={formProps}
                        elementRepresentation={elementRepresentation}
                    />
                )
            })}
            { editing ?
                <NestedScopeElement
                    element={{}}
                    onSubmit={onSubmit}
                    formComponent={formComponent}
                    formProps={formProps}
                    showForm={editing}
                    elementRepresentation={elementRepresentation}
                /> : null
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
