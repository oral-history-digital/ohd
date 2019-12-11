import React from 'react';
import Observer from 'react-intersection-observer'
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import DataContainer from '../containers/DataContainer';
import Form from '../containers/form/Form';
import { t, admin, pluralize, parametrizedQuery, statifiedQuery, camelcase } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class WrappedDataList extends React.Component {

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
        } else if (!this.props.resultPagesCount || this.props.resultPagesCount > (this.props.query.page)) {
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
            this.props.fetchData(this.props, pluralize(this.props.scope), null, null, parametrizedQuery(this.props.query));
        }
    }

    sortedData() {
        let _this = this;
        let sorted = [];
        if (this.props.data) {
            if (this.props.sortAttribute) { 
                sorted = Object.values(this.props.data).sort(function(a, b){
                    let aa = _this.props.sortAttributeTranslated ? a[_this.props.sortAttribute][_this.props.locale] : a[_this.props.sortAttribute]
                    let bb = _this.props.sortAttributeTranslated ? b[_this.props.sortAttribute][_this.props.locale] : b[_this.props.sortAttribute]
                    if (aa < bb)
                        return -1;
                    if ( aa > bb)
                        return 1;
                    return 0;
                })
            } else {
                sorted = Object.values(this.props.data)
            }
        }
        return sorted;
    }

    data() {
        return this.sortedData().map((data, index) => {
            return (
                <DataContainer 
                    data={data} 
                    scope={this.props.scope}
                    detailsAttributes={this.props.detailsAttributes}
                    joinedData={this.props.joinedData}
                    form={this.form}
                    hideEdit={this.props.hideEdit}
                    hideDelete={this.props.hideDelete}
                    key={`${this.props.scope}-${data.id}`} 
                />
            )
        })
    }

    form(data) {
        let _this = this;
        return (
            <Form 
                data={data}
                //values={{ id: data && data.id }}
                scope={this.props.scope}
                onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                submitText='submit'
                elements={this.props.formElements}
            />
        );
    }

    add() {
        if (admin(this.props, {type: camelcase(this.props.scope), action: 'create'})) {
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
                    <div className='wrapper-content register'>
                        <h1 className='registry-entries-title'>
                            {t(this.props, `activerecord.models.${this.props.scope}.other`)}
                        </h1>
                        {this.add()}
                        {this.data()}
                        {this.add()}
                        {this.renderScrollObserver()}
                    </div>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
