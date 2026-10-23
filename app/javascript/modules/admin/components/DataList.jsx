import { createElement, useEffect, useRef } from 'react';

import { AuthorizedContent } from 'modules/auth';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { usePathBase, useProjectIdentity } from 'modules/routes';
import { camelCase, pluralize } from 'modules/strings';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import AdminRecord from './AdminRecord';
import EditViewOrRedirect from './EditViewOrRedirect';

/**
 * Lists resource records with route-based requests; project identity is used only for status keys.
 * @param {Object} props - Resource records, query state, form configuration, and Redux actions.
 * @returns {React.ReactElement} Resource list and administration controls.
 */
export default function DataList({
    data,
    scope,
    outerScope,
    outerScopeId,
    optionsScope,
    detailsAttributes,
    sensitiveAttributes = [],
    joinedData,
    showComponent,
    interview,
    hideAdd,
    hideShow,
    hideEdit,
    hideDelete,
    editView,
    task,
    joinDataStatus,
    joinDataScope,
    statuses,
    otherDataToLoad = [],
    fetchData,
    form,
    initialFormValues,
    formElements,
    helpTextCode,
    submitData,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const { projectDbId } = useProjectIdentity();

    const initializedFor = useRef(null);
    useEffect(() => {
        const routeKey = `${pathBase}/${projectDbId}`;
        if (!projectDbId || initializedFor.current === routeKey) return;
        initializedFor.current = routeKey;
        if (
            joinDataStatus &&
            !(
                joinDataStatus[`for_projects_${projectDbId}`] ||
                joinDataStatus.all
            )
        ) {
            fetchData({ pathBase }, joinDataScope, null, null, null);
        }
        otherDataToLoad.forEach((dataType) => {
            if (!statuses?.[dataType]?.all)
                fetchData({ pathBase }, pluralize(dataType), null, null, 'all');
        });
    }, [
        fetchData,
        joinDataScope,
        joinDataStatus,
        otherDataToLoad,
        pathBase,
        projectDbId,
        statuses,
    ]);

    function createForm(data, onSubmit, onCancel) {
        if (form) {
            return createElement(form, {
                data,
                values: initialFormValues,
                onSubmit,
                scope,
            });
        } else {
            return (
                <Form
                    data={data}
                    values={initialFormValues}
                    scope={scope}
                    helpTextCode={helpTextCode}
                    onSubmit={(params) => {
                        submitData(
                            { pathBase },
                            params,
                            undefined,
                            // Force refetch of list data after submit, to reflect any changes
                            () => {
                                if (typeof onSubmit === 'function') {
                                    onSubmit();
                                }
                            }
                        );
                    }}
                    onCancel={onCancel}
                    submitText="submit"
                    elements={formElements}
                />
            );
        }
    }

    return (
        <EditViewOrRedirect>
            <div>
                <ErrorBoundary>
                    {data &&
                        Object.keys(data).map((c) => (
                            <AdminRecord
                                key={data[c].id ?? c}
                                data={data[c]}
                                scope={scope}
                                sensitiveAttributes={sensitiveAttributes}
                                outerScope={outerScope}
                                outerScopeId={outerScopeId}
                                optionsScope={optionsScope}
                                detailsAttributes={detailsAttributes}
                                joinedData={joinedData}
                                form={createForm}
                                showComponent={showComponent}
                                hideShow={hideShow}
                                hideEdit={hideEdit}
                                hideDelete={hideDelete}
                                editView={editView}
                                task={task}
                            />
                        ))}
                    {!hideAdd && (
                        <AuthorizedContent
                            object={[
                                {
                                    type: camelCase(scope),
                                    interview_id: interview?.id,
                                },
                                task,
                            ]}
                            action="create"
                        >
                            <Modal
                                title={t(`edit.${scope}.new`)}
                                trigger={
                                    <>
                                        <FaPlus className="Icon Icon--editorial" />{' '}
                                        {t(`edit.${scope}.new`)}
                                    </>
                                }
                            >
                                {(close) => createForm(undefined, close, close)}
                            </Modal>
                        </AuthorizedContent>
                    )}
                </ErrorBoundary>
            </div>
        </EditViewOrRedirect>
    );
}

DataList.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    form: PropTypes.func,
    initialFormValues: PropTypes.object,
    scope: PropTypes.string,
    task: PropTypes.object,
    formElements: PropTypes.array,
    helpTextCode: PropTypes.string,
    joinDataScope: PropTypes.string,
    joinDataStatus: PropTypes.object,
    interview: PropTypes.object,
    outerScope: PropTypes.string,
    outerScopeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    optionsScope: PropTypes.string,
    detailsAttributes: PropTypes.array,
    sensitiveAttributes: PropTypes.array,
    otherDataToLoad: PropTypes.array,
    statuses: PropTypes.object,
    joinedData: PropTypes.object,
    showComponent: PropTypes.node,
    hideShow: PropTypes.bool,
    hideEdit: PropTypes.bool,
    hideDelete: PropTypes.bool,
    editView: PropTypes.bool,
    hideAdd: PropTypes.bool,
    fetchData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
};
