import { createElement, Component } from 'react';
import Observer from 'react-intersection-observer'
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { AuthShowContainer } from 'modules/auth';
import { Form } from 'modules/forms';
import { Spinner } from 'modules/spinners';
import { pluralize } from 'modules/strings';
import { t } from 'modules/i18n';
import parametrizedQuery from './parametrizedQuery';
import statifiedQuery from './statifiedQuery';
import DataContainer from './DataContainer';
import AddButton from './AddButton';
import sortData from './sortData';

export default class WrappedDataList extends Component {
    constructor(props) {
        super(props);
        this.form = this.form.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        // Load data
        const { query, project, dataStatus, scope, scopeId, nestedScope,
            fetchData } = this.props;

        if (
            query &&
            !(dataStatus[`for_projects_${project?.id}`] || dataStatus.all || dataStatus[statifiedQuery(query)])
        ) {
            fetchData(
                this.props,
                pluralize(scope),
                scopeId || null,
                nestedScope ? pluralize(nestedScope) : null,
                parametrizedQuery(query)
            );
        }
    }

    renderScrollObserver() {
        const { query, dataStatus, project, resultPagesCount } = this.props;

        if (query) {
            if (
                 !(
                     /^fetched/.test(dataStatus[`for_projects_${project?.id}`]) ||
                     /^fetched/.test(dataStatus.all)
                 )
            ) {
                if (
                    dataStatus[statifiedQuery(query)]?.split('-')[0] === 'fetching'
                ) {
                    return <Spinner />;
                } else if (!resultPagesCount || resultPagesCount > parseInt(query.page)) {
                    return (
                        <Observer
                            onChange={inView => this.handleScroll(inView)}
                        />
                    )
                }
            }
        }
    }

    handleScroll(inView) {
        const { scope, nestedScope, scopeId, query, setQueryParams, fetchData } = this.props;

        if(inView){
            setQueryParams(pluralize(nestedScope || scope), {page: query.page + 1});
            fetchData(
                this.props,
                pluralize(scope),
                scopeId || null,
                nestedScope ? pluralize(nestedScope) : null,
                parametrizedQuery(query)
            );
        }
    }

    form(data, onSubmit, onCancel) {
        const { form, initialFormValues, scope, formElements, helpTextCode,
            submitData } = this.props;

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
                        submitData(this.props, params);
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

    render() {
        const { data, sortAttribute, sortAttributeTranslated, locale, scope,
            interview, task, hideAdd, outerScope, outerScopeId,
            detailsAttributes, joinedData, hideEdit, hideDelete,
            showComponent } = this.props;

        const sortedData = sortData(data, sortAttribute, sortAttributeTranslated,
            locale);

        return (
            <div className='wrapper-content register'>
                <Helmet>
                    <title>
                        {t(this.props, `activerecord.models.${scope}.other`)}
                    </title>
                </Helmet>

                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className="registry-entries-title">
                        {t(this.props, `activerecord.models.${scope}.other`)}
                    </h1>

                    {!hideAdd && (
                        <AddButton
                            scope={scope}
                            interview={interview}
                            task={task}
                            onClose={closeModal => this.form(undefined, closeModal, closeModal)}
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
                            form={this.form}
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
                            onClose={closeModal => this.form(undefined, closeModal, closeModal)}
                        />
                    )}

                    {this.renderScrollObserver()}
                </AuthShowContainer>

                <AuthShowContainer ifLoggedOut ifNoProject>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        );
    }
}

WrappedDataList.propTypes = {
    data: PropTypes.object,
    joinedData: PropTypes.object,
    locale: PropTypes.string,
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
    project: PropTypes.object,
    hideAdd: PropTypes.bool,
    hideEdit: PropTypes.bool,
    hideDelete: PropTypes.bool,
    showComponent: PropTypes.object,
    submitData: PropTypes.func.isRequired,
    setQueryParams: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
