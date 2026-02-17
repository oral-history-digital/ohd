import { createElement, useState } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

export default function NestedScopeElement({
    element,
    index,
    formProps,
    submitHandler,
    deleteHandler,
    formComponent,
    showForm,
    scope,
    elementRepresentation,
}) {
    const { t } = useI18n();

    const [editing, setEditing] = useState(!!showForm);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const cancel = () => setEditing(false);

    return (
        <div className={classNames('nested-scope-element', scope)}>
            {editing ? (
                createElement(formComponent, {
                    ...formProps,
                    nested: true,
                    data: element,
                    key: `nse-form-${index}-${element.creation_date}`,
                    index: index,
                    submitData: submitHandler,
                    onSubmitCallback: cancel,
                    onCancel: cancel,
                    formClasses: 'nested-form default',
                })
            ) : (
                <div>
                    {elementRepresentation(element)}

                    {editing ? null : (
                        <button
                            type="button"
                            className="Button Button--transparent Button--icon"
                            title={t(
                                `edit.default.${editing ? 'cancel' : 'edit'}`
                            )}
                            onClick={() => setEditing(!editing)}
                        >
                            <FaPencilAlt className="Icon Icon--editorial" />
                        </button>
                    )}

                    {showConfirmDelete && (
                        <button
                            type="button"
                            className="Button Button--transparent Button--icon"
                            title={t('really_destroy')}
                            onClick={deleteHandler}
                        >
                            <FaTrash className="Icon Icon--danger" />
                        </button>
                    )}

                    {!showConfirmDelete && (
                        <button
                            type="button"
                            className="Button Button--transparent Button--icon"
                            title={t('delete')}
                            onClick={() => setShowConfirmDelete(true)}
                        >
                            <FaTrash className="Icon Icon--editorial" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

NestedScopeElement.propTypes = {
    element: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    formProps: PropTypes.object,
    submitHandler: PropTypes.func.isRequired,
    deleteHandler: PropTypes.func.isRequired,
    formComponent: PropTypes.elementType.isRequired,
    showForm: PropTypes.bool,
    scope: PropTypes.string.isRequired,
    elementRepresentation: PropTypes.func.isRequired,
};
