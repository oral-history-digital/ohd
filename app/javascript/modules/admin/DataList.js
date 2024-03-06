import { createElement, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { useProject } from 'modules/routes';
import { camelCase, pluralize } from 'modules/strings';
import { Modal } from 'modules/ui';
import DataContainer from './DataContainer';
import EditViewOrRedirect from './EditViewOrRedirect';

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
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    useEffect(() => {
        loadJoinData();
        if (otherDataToLoad.length) {
            otherDataToLoad.forEach((d) => {
                if (!statuses?.[d]?.all) {
                    fetchData({ locale, project, projectId }, pluralize(d), null, null, 'all');
                }
            });
        }
    }, []);

    function loadJoinData() {
        if (joinDataStatus
            && !(joinDataStatus[`for_projects_${project?.id}`] || joinDataStatus.all)
        ) {
            fetchData({ locale, project, projectId }, joinDataScope, null, null, null);
        }
     }

    function createForm(data, onSubmit, onCancel) {
        if (form) {
            return createElement(form, {
                data,
                values: initialFormValues,
                onSubmit,
            });
        } else {
            return (
                <Form
                    data={data}
                    values={initialFormValues}
                    scope={scope}
                    helpTextCode={helpTextCode}
                    onSubmit={(params) => {
                        submitData({ locale, project, projectId }, params);
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                    onCancel={onCancel}
                    submitText='submit'
                    elements={formElements}
                />
            );
        }
    }

    return (
        <EditViewOrRedirect>
            <div>
                <ErrorBoundary>
                    {data && Object.keys(data).map((c) => (
                        <DataContainer
                            key={c}
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
                            object={[{type: camelCase(scope), interview_id: interview?.id}, task]}
                            action='create'
                        >
                            <Modal
                                title={t(`edit.${scope}.new`)}
                                trigger={<><FaPlus className="Icon Icon--editorial"/> {t(`edit.${scope}.new`)}</>}
                            >
                                {close => createForm(undefined, close, close)}
                            </Modal>
                        </AuthorizedContent>
                    )}
                </ErrorBoundary>
            </div>
        </EditViewOrRedirect>
    );
}

DataList.propTypes = {
    data: PropTypes.object,
    form: PropTypes.object,
    initialFormValues: PropTypes.object,
    scope: PropTypes.string,
    task: PropTypes.object,
    formElements: PropTypes.array,
    helpTextCode: PropTypes.string,
    joinDataScope: PropTypes.string,
    joinDataStatus: PropTypes.string,
    interview: PropTypes.object,
    outerScope: PropTypes.string,
    outerScopeId: PropTypes.string,
    optionsScope: PropTypes.string,
    detailsAttributes: PropTypes.object,
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
