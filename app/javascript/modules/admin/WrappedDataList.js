import { createElement, Component } from 'react';
import Observer from 'react-intersection-observer'
import { FaPlus } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { AuthShowContainer } from 'modules/auth';
import { Form } from 'modules/forms';
import { Spinner } from 'modules/spinners';
import { AuthorizedContent } from 'modules/auth';
import { Modal } from 'modules/ui';
import { pluralize, camelCase } from 'modules/strings';
import { t } from 'modules/i18n';
import parametrizedQuery from './parametrizedQuery';
import statifiedQuery from './statifiedQuery';
import DataContainer from './DataContainer';

export default class WrappedDataList extends Component {
    constructor(props) {
        super(props);
        this.form = this.form.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.renderScrollObserver = this.renderScrollObserver.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
         if (
             this.props.query &&
             !(this.props.dataStatus[`for_projects_${this.props.project?.id}`] || this.props.dataStatus.all || this.props.dataStatus[statifiedQuery(this.props.query)])
         ) {
            this.props.fetchData(
                this.props,
                pluralize(this.props.scope),
                this.props.scopeId || null,
                this.props.nestedScope ? pluralize(this.props.nestedScope) : null,
                parametrizedQuery(this.props.query)
            );
         }
     }

    renderScrollObserver() {
        if (this.props.query) {
            if (
                 !(
                     /^fetched/.test(this.props.dataStatus[`for_projects_${this.props.project?.id}`]) ||
                     /^fetched/.test(this.props.dataStatus.all)
                 )
            ) {
                if (
                    this.props.dataStatus[statifiedQuery(this.props.query)]?.split('-')[0] === 'fetching'
                ) {
                    return <Spinner />;
                } else if (!this.props.resultPagesCount || this.props.resultPagesCount > parseInt(this.props.query.page)) {
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
        if(inView){
            this.props.setQueryParams(pluralize(this.props.nestedScope || this.props.scope), {page: this.props.query.page + 1});
            this.props.fetchData(
                this.props,
                pluralize(this.props.scope),
                this.props.scopeId || null,
                this.props.nestedScope ? pluralize(this.props.nestedScope) : null,
                parametrizedQuery(this.props.query)
            );
        }
    }

    sortedData() {
        const { data, sortAttribute, sortAttributeTranslated, locale } = this.props;

        let sorted = [];
        if (data) {
            if (sortAttribute) {
                sorted = Object.values(data).sort((a, b) => {
                    let aa = sortAttributeTranslated ? a[sortAttribute][locale] : a[sortAttribute]
                    let bb = sortAttributeTranslated ? b[sortAttribute][locale] : b[sortAttribute]
                    if (aa < bb)
                        return -1;
                    if ( aa > bb)
                        return 1;
                    return 0;
                })
            } else {
                sorted = Object.values(data)
            }
        }
        return sorted.filter(s => s);
    }

    data() {
        return this.sortedData().map((data, index) => {
            return (
                <DataContainer
                    data={data}
                    scope={this.props.scope}
                    outerScope={this.props.outerScope}
                    outerScopeId={this.props.outerScopeId}
                    detailsAttributes={this.props.detailsAttributes}
                    joinedData={this.props.joinedData}
                    form={this.form}
                    showComponent={this.props.showComponent}
                    hideEdit={this.props.hideEdit}
                    hideDelete={this.props.hideDelete}
                    key={`${this.props.scope}-${data.id}`}
                />
            )
        })
    }

    form(data, onSubmit, onCancel) {
        const { form, initialFormValues, scope, formElements, submitData } = this.props;

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
                    submitText='submit'
                    elements={formElements}
                />
            );
        }
    }

    add() {
        if (!this.props.hideAdd) {
            return (
                <AuthorizedContent object={[{type: camelCase(this.props.scope), interview_id: this.props.interview?.id}, this.props.task]} action='create'>
                    <Modal
                        title={t(this.props, `edit.${this.props.scope}.new`)}
                        trigger={<><FaPlus className="Icon Icon--editorial" /> {t(this.props, `edit.${this.props.scope}.new`)}</>}
                    >
                        {close => this.form(undefined, close, close)}
                    </Modal>
                </AuthorizedContent>
            )
        }
    }

    render() {
        const { scope } = this.props;

        return (
            <div className='wrapper-content register'>
                <Helmet>
                    <title>{t(this.props, `activerecord.models.${scope}.other`)}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className='registry-entries-title'>
                        {t(this.props, `activerecord.models.${scope}.other`)}
                    </h1>
                    {this.add()}
                    {this.data()}
                    {this.add()}
                    {this.renderScrollObserver()}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        );
    }
}

WrappedDataList.propTypes = {
    interview: PropTypes.object,
    scope: PropTypes.string.isRequired,
    hideAdd: PropTypes.bool,
};
