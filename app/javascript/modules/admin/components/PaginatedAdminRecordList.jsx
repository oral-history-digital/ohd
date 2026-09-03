import { createElement } from 'react';

import { AuthShowContainer } from 'modules/auth';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Observer from 'react-intersection-observer';

import AddButton from '../AddButton';
import EditViewOrRedirect from '../EditViewOrRedirect';
import { usePaginatedAdminRecords } from '../hooks';
import sortData from '../sortData';
import AdminRecord from './AdminRecord';

export default function PaginatedAdminRecordList({
    form,
    formElements,
    initialFormValues,
    helpTextCode,
    query,
    data,
    dataStatus,
    statuses,
    otherDataToLoad = [],
    sortAttribute,
    sortAttributeTranslated,
    scope,
    interview,
    task,
    hideAdd,
    hideRegisterDoiAction,
    outerScope,
    outerScopeId,
    resultPagesCount,
    detailsAttributes,
    sensitiveAttributes = [],
    joinedData,
    hideEdit,
    hideDelete,
    showComponent,
    scopeId,
    nestedScope,
    fetchData,
    submitData,
    setQueryParams,
}) {
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    const { hasMorePages, isFetching, loadNextPage, shouldShowPagination } =
        usePaginatedAdminRecords({
            query,
            dataStatus,
            statuses,
            otherDataToLoad,
            resultPagesCount,
            scope,
            scopeId,
            nestedScope,
            fetchData,
            setQueryParams,
            locale,
            project,
            projectId,
        });

    function createForm(data, onSubmit, onCancel) {
        if (form) {
            return createElement(form, {
                data,
                values: initialFormValues,
                onSubmit,
                onCancel,
            });
        } else {
            return (
                <Form
                    data={data}
                    values={initialFormValues}
                    scope={scope}
                    onSubmit={(params) => {
                        submitData({ locale, project, projectId }, params);
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                    onCancel={onCancel}
                    submitText="submit"
                    elements={formElements}
                    helpTextCode={helpTextCode}
                />
            );
        }
    }

    const sortedData = sortData(
        data,
        sortAttribute,
        sortAttributeTranslated,
        locale
    );

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t(`activerecord.models.${scope}.other`)}</title>
                </Helmet>

                <AuthShowContainer hasProjectAccess>
                    <h1 className="Page-main-title">
                        {t(`activerecord.models.${scope}.other`)}
                    </h1>

                    {!hideAdd && (
                        <AddButton
                            scope={scope}
                            interview={interview}
                            task={task}
                            onClose={(closeModal) =>
                                createForm(undefined, closeModal, closeModal)
                            }
                        />
                    )}

                    {sortedData.map((data) => (
                        <AdminRecord
                            data={data}
                            scope={scope}
                            sensitiveAttributes={sensitiveAttributes}
                            outerScope={outerScope}
                            outerScopeId={outerScopeId}
                            detailsAttributes={detailsAttributes}
                            joinedData={joinedData}
                            form={createForm}
                            showComponent={showComponent}
                            hideEdit={hideEdit}
                            hideRegisterDoiAction={hideRegisterDoiAction}
                            hideDelete={hideDelete}
                            key={`${scope}-${data.id}`}
                        />
                    ))}

                    {!hideAdd && (
                        <AddButton
                            scope={scope}
                            interview={interview}
                            task={task}
                            onClose={(closeModal) =>
                                createForm(undefined, closeModal, closeModal)
                            }
                        />
                    )}

                    {shouldShowPagination &&
                        (isFetching ? (
                            <Spinner />
                        ) : (
                            hasMorePages && <Observer onChange={loadNextPage} />
                        ))}
                </AuthShowContainer>

                <AuthShowContainer ifLoggedOut ifNoProject>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}

PaginatedAdminRecordList.propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    joinedData: PropTypes.object,
    helpTextCode: PropTypes.string,
    sortAttribute: PropTypes.string,
    sortAttributeTranslated: PropTypes.bool,
    detailsAttributes: PropTypes.array,
    sensitiveAttributes: PropTypes.array,
    form: PropTypes.object,
    initialFormValues: PropTypes.object,
    formElements: PropTypes.array.isRequired,
    interview: PropTypes.object,
    task: PropTypes.object,
    scope: PropTypes.string.isRequired,
    scopeId: PropTypes.number,
    nestedScope: PropTypes.string,
    outerScope: PropTypes.string,
    outerScopeId: PropTypes.number,
    query: PropTypes.object,
    dataStatus: PropTypes.object,
    statuses: PropTypes.object,
    otherDataToLoad: PropTypes.array,
    resultPagesCount: PropTypes.number,
    hideAdd: PropTypes.bool,
    hideEdit: PropTypes.bool,
    hideRegisterDoiAction: PropTypes.bool,
    hideDelete: PropTypes.bool,
    showComponent: PropTypes.elementType,
    submitData: PropTypes.func.isRequired,
    setQueryParams: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
