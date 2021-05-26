import React from 'react';
import Observer from 'react-intersection-observer'

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

export default class WrappedDataList extends React.Component {

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
             !(this.props.dataStatus.all || this.props.dataStatus[statifiedQuery(this.props.query)])
         ) {
            this.props.fetchData(this.props, pluralize(this.props.scope), null, null, parametrizedQuery(this.props.query));
         }
     }

    renderScrollObserver() {
        if (this.props.query) {
            if (
                this.props.dataStatus.all !== 'fetched'
            ) {
                if (
                    this.props.dataStatus[statifiedQuery(this.props.query)] &&
                    this.props.dataStatus[statifiedQuery(this.props.query)].split('-')[0] === 'fetching'
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
                    showComponent={this.props.showComponent}
                    hideEdit={this.props.hideEdit}
                    hideDelete={this.props.hideDelete}
                    key={`${this.props.scope}-${data.id}`}
                />
            )
        })
    }

    form(data, onSubmit) {
        if (this.props.form) {
            return React.createElement(this.props.form, {data: data, values: this.props.initialFormValues});
        } else {
            return (
                <Form
                    data={data}
                    values={this.props.initialFormValues}
                    scope={this.props.scope}
                    onSubmit={(params) => {this.props.submitData(this.props, params); this.props.closeArchivePopup()}}
                    submitText='submit'
                    elements={this.props.formElements}
                />
            );
        }
    }

    add() {
        if (!this.props.hideAdd) {
            return (
                <AuthorizedContent object={[{type: camelCase(this.props.scope), interview_id: this.props.interview?.id}, this.props.task]} action: 'create'>
                    <Modal
                        title={t(this.props, `edit.${this.props.scope}.new`)}
                        trigger={<><i className="fa fa-plus"/>{t(this.props, `edit.${this.props.scope}.new`)}</>}
                    >
                        {close => this.form(undefined, close)}
                    </Modal>
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
