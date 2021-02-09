import React from 'react';
import Observer from 'react-intersection-observer'

import { AuthShowContainer } from 'modules/auth';
import { Form } from 'modules/forms';
import { Spinner } from 'modules/spinners';
import { AuthorizedContent } from 'modules/auth';
import { ArchivePopupButton } from 'modules/ui';
import { pluralize, parametrizedQuery, statifiedQuery, camelcase } from 'lib/utils';
import { t } from 'modules/i18n';
import DataContainer from './DataContainer';

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
            return <Spinner />;
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
                values={this.props.initialFormValues}
                scope={this.props.scope}
                onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                submitText='submit'
                elements={this.props.formElements}
            />
        );
    }

    add() {
        if (!this.props.hideAdd) {
            return (
                <AuthorizedContent object={[{type: camelcase(this.props.scope), action: 'create', interview_id: this.props.interview?.id}, this.props.task]}>
                    <ArchivePopupButton
                        title={t(this.props, `edit.${this.props.scope}.new`)}
                        buttonFaKey='plus'
                    >
                        {this.form()}
                    </ArchivePopupButton>
                </AuthorizedContent>
            )
        }
    }

    render() {
        return (
            <div className='wrapper-content register'>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className='registry-entries-title'>
                        {t(this.props, `activerecord.models.${this.props.scope}.other`)}
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
