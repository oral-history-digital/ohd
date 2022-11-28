import { createElement, useState } from 'react';
import classNames from 'classnames';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';

export default function NestedScopeElement({
    element,
    index,
    formProps,
    onSubmit,
    onDelete,
    submitData,
    deleteData,
    formComponent,
    showForm,
    scope,
    elementRepresentation,
    locale,
    projectId,
    projects,
}) {
    const { t } = useI18n();
    const [editing, setEditing] = useState(!!showForm);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const cancel = () => setEditing(false);

    console.log(elementRepresentation)

    return (
        <div className={classNames('nested-scope-element', scope)} >
            { editing ?
                createElement(formComponent, {...formProps,
                    nested: true,
                    data: element,
                    index: index,
                    submitData: !!element.id ? submitData : onSubmit,
                    onSubmitCallback: cancel,
                    onCancel: cancel,
                    formClasses: 'nested-form default',
                }) :
                <div>
                    {elementRepresentation(element)}

                    { editing ? null :
                        <button
                            type="button"
                            className="Button Button--transparent Button--icon"
                            title={t(`edit.default.${editing ? 'cancel' : 'edit'}`)}
                            onClick={() => setEditing(!editing)}
                        >
                            <FaPencilAlt className="Icon Icon--editorial" />
                        </button>
                    }

                    { showConfirmDelete && <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t('really_destroy')}
                        onClick={() => {
                            !!element.id ?
                            deleteData({locale, projectId, projects}, pluralize(scope), element.id, null, null, false) :
                            onDelete(index, scope)
                        }}
                    >
                        <FaTrash className="Icon Icon--danger" />
                    </button> }

                    { !showConfirmDelete && <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        title={t('delete')}
                        onClick={() => setShowConfirmDelete(true)}
                    >
                        <FaTrash className="Icon Icon--editorial" />
                    </button> }
                </div>
            }
        </div>
    )
}
