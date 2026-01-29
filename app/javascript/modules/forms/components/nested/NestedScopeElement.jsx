import { createElement, useState } from 'react';

import classNames from 'classnames';
import { getLocale, getProjectId } from 'modules/archive';
import { deleteData, getCurrentProject, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { pluralize } from 'modules/strings';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

export default function NestedScopeElement({
    element,
    index,
    formProps,
    onSubmit,
    onDelete,
    onDeleteCallback,
    formComponent,
    showForm,
    scope,
    elementRepresentation,
}) {
    const { t } = useI18n();
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);
    const dispatch = useDispatch();

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
                    // eslint-disable-next-line no-extra-boolean-cast
                    submitData: !!element.id // TODO: Clarify if element.id can be 0 (valid ID) - if not, remove !!
                        ? (params, args) => dispatch(submitData(params, args))
                        : onSubmit,
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
                            onClick={() => {
                                if (typeof element.id === 'undefined') {
                                    onDelete(index, scope);
                                } else {
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
                                }
                            }}
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
    onSubmit: PropTypes.func,
    onDelete: PropTypes.func,
    onDeleteCallback: PropTypes.func,
    formComponent: PropTypes.elementType.isRequired,
    showForm: PropTypes.bool,
    scope: PropTypes.string.isRequired,
    elementRepresentation: PropTypes.func.isRequired,
};
