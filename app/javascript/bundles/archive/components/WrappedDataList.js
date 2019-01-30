import React from 'react';
import Observer from 'react-intersection-observer'
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import DataContainer from '../containers/DataContainer';
import Form from '../containers/form/Form';
import { t, admin, pluralize, parametrizedQuery, statifiedQuery } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class WrappedDataLists extends React.Component {

    constructor(props) {
        super(props);
        this.form = this.form.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.renderScrollObserver = this.renderScrollObserver.bind(this);
    }

    renderScrollObserver() {
        if (
            this.props.dataStatus[statifiedQuery(this.props.query)] && 
            this.props.dataStatus[statifiedQuery(this.props.query)].split('-')[0] === 'fetching'
        ) {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        } else if (this.props.resultPagesCount > (this.props.query.page)) {
            return (
                <Observer
                    onChange={inView => this.handleScroll(inView)}
                />
            )
        }
    }

    handleScroll(inView) {
        if(inView){
            this.props.setQueryParams(pluralize(this.props.scope), {page: this.props.query.page + 1});
            this.props.fetchData(pluralize(this.props.scope), null, null, this.props.locale, parametrizedQuery(this.props.query));
        }
    }

    data() {
        if (this.props.data) {
            return Object.keys(this.props.data).map((c, index) => {
                return (
                    <DataContainer 
                        data={this.props.data[c]} 
                        scope={this.props.scope}
                        detailsAttributes={this.props.detailsAttributes}
                        joinedData={this.props.joinedData}
                        form={this.form}
                        hideEdit={this.props.hideEdit}
                        key={`${this.props.scope}-${c}`} 
                    />
                )
            })
        } else {
            return null;
        }
    }

    form(data) {
        let _this = this;
        return (
            <Form 
                data={data}
                //values={{ id: data && data.id }}
                scope={this.props.scope}
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                submitText='submit'
                elements={this.props.formElements}
            />
        );
    }

    add() {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, `edit.${this.props.scope}.new`)}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, `edit.${this.props.scope}.new`),
                        content: this.form()
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        }
    }

    render() {
        let tabIndex = this.props.locales.length + this.props.baseTabIndex;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1>{t(this.props, `activerecord.models.${this.props.scope}.other`)}</h1>
                    {this.data()}
                    {this.add()}
                    {this.renderScrollObserver()}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
