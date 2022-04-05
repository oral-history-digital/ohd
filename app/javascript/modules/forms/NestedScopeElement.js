import { createElement, useState } from 'react';

export default function NestedScopeElement({
    element,
    formProps,
    onSubmit,
    formComponent,
    showForm,
    elementRepresentation,
}) {
    const [editing, setEditing] = useState(showForm);

    return (
        <>
            { editing ?
                createElement(formComponent, {...formProps, ...{data: element, onSubmit: onSubmit, onSubmitCallback: setEditing}}) :
                elementRepresentation(element)
            }
        </>
    )
}
