import { createElement, useEffect } from 'react';
import Observer from 'react-intersection-observer'
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { AuthShowContainer } from 'modules/auth';
import { Form } from 'modules/forms';
import { Spinner } from 'modules/spinners';
import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import parametrizedQuery from './parametrizedQuery';
import statifiedQuery from './statifiedQuery';
import DataContainer from './DataContainer';
import AddButton from './AddButton';
import sortData from './sortData';
import EditViewOrRedirect from './EditViewOrRedirect';

export default function WrappedDataList({
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
    outerScope,
    outerScopeId,
    resultPagesCount,
    detailsAttributes,
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

    useEffect(() => {
        if (
            query &&
            !(dataStatus?.[`for_projects_${project?.id}`] || dataStatus?.all || dataStatus?.[statifiedQuery(query)])
        ) {
            fetchData(
                { locale, project, projectId },
                pluralize(scope),
                scopeId || null,
                nestedScope ? pluralize(nestedScope) : null,
                parametrizedQuery(query)
            );
        }
        if (otherDataToLoad.length) {
            otherDataToLoad.forEach((d) => {
                if (!statuses?.[d]?.all) {
                    fetchData({ locale, project, projectId }, pluralize(d), null, null, 'all');
                }
            });
        }
    }, []);

    function handleScroll(inView) {
        if(inView){
            setQueryParams(pluralize(nestedScope || scope), {page: query.page + 1});
            fetchData(
                { locale, project, projectId },
                pluralize(scope),
                scopeId || null,
                nestedScope ? pluralize(nestedScope) : null,
                parametrizedQuery(query)
            );
        }
    }

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

    const sortedData = sortData(data, sortAttribute, sortAttributeTranslated,
        locale);

    const notFetched = !(/^fetched/.test(dataStatus?.[`for_projects_${project?.id}`])
        || /^fetched/.test(dataStatus?.all));
    const fetching = dataStatus?.[statifiedQuery(query)]?.split('-')[0] === 'fetching';
    const hasMorePages = !resultPagesCount || resultPagesCount > parseInt(query.page);

    return (
        <EditViewOrRedirect>
            <div className='wrapper-content register'>
                <Helmet>
                    <title>
                        {t(`activerecord.models.${scope}.other`)}
                    </title>
                </Helmet>

                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className="registry-entries-title">
                        {t(`activerecord.models.${scope}.other`)}
                    </h1>

                    {!hideAdd && (
                        <AddButton
                            scope={scope}
                            interview={interview}
                            task={task}
                            onClose={closeModal => createForm(undefined, closeModal, closeModal)}
                        />
                    )}

                    {sortedData.map(data => (
                        <DataContainer
                            data={data}
                            scope={scope}
                            outerScope={outerScope}
                            outerScopeId={outerScopeId}
                            detailsAttributes={detailsAttributes}
                            joinedData={joinedData}
                            form={createForm}
                            showComponent={showComponent}
                            hideEdit={hideEdit}
                            hideDelete={hideDelete}
                            key={`${scope}-${data.id}`}
                        />
                    ))}

                    {!hideAdd && (
                        <AddButton
                            scope={scope}
                            interview={interview}
                            task={task}
                            onClose={closeModal => createForm(undefined, closeModal, closeModal)}
                        />
                    )}

                    {query && notFetched && (
                        fetching ?
                            (<Spinner />) :
                            (hasMorePages && (
                                <Observer
                                    onChange={inView => handleScroll(inView)}
                                />
                            ))
                    )}
                </AuthShowContainer>

                <AuthShowContainer ifLoggedOut ifNoProject>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}

WrappedDataList.propTypes = {
    data: PropTypes.object,
    joinedData: PropTypes.object,
    helpTextCode: PropTypes.string,
    sortAttribute: PropTypes.string,
    sortAttributeTranslated: PropTypes.bool,
    detailsAttributes: PropTypes.array,
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
    resultPagesCount: PropTypes.number,
    hideAdd: PropTypes.bool,
    hideEdit: PropTypes.bool,
    hideDelete: PropTypes.bool,
    showComponent: PropTypes.object,
    submitData: PropTypes.func.isRequired,
    setQueryParams: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
