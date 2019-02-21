import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import TasksContainer from '../containers/TasksContainer';
import UserRolesContainer from '../containers/UserRolesContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t, admin, pluralize } from '../../../lib/utils';

export default class WrappedAccount extends React.Component {

    constructor(props) {
        super(props);
        //this.form = this.form.bind(this);
    }

    //data() {
        //if (this.props.data) {
            //return Object.keys(this.props.data).map((c, index) => {
                //return (
                    //<DataContainer 
                        //data={this.props.data[c]} 
                        //scope={this.props.scope}
                        //detailsAttributes={this.props.detailsAttributes}
                        //joinedData={this.props.joinedData}
                        //form={this.form}
                        //hideEdit={this.props.hideEdit}
                        //key={`${this.props.scope}-${c}`} 
                    ///>
                //)
            //})
        //} else {
            //return null;
        //}
    //}

    //form(data) {
        //let _this = this;
        //return (
            //<Form 
                //data={data}
                ////values={{ id: data && data.id }}
                //scope={this.props.scope}
                //onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                //submitText='submit'
                //elements={this.props.formElements}
            ///>
        //);
    //}

    //add() {
        //if (admin(this.props)) {
            //return (
                //<div
                    //className='flyout-sub-tabs-content-ico-link'
                    //title={t(this.props, `edit.${this.props.scope}.new`)}
                    //onClick={() => this.props.openArchivePopup({
                        //title: t(this.props, `edit.${this.props.scope}.new`),
                        //content: this.form()
                    //})}
                //>
                    //<i className="fa fa-plus"></i>
                //</div>
            //)
        //}
    //}

    roles() {
        return (
            <div className={'roles box'}>
                <div className='title'>{t(this.props, 'activerecord.models.role.other')}</div>
                <UserRolesContainer userRoles={this.props.account.roles || []} userId={this.props.account.user_id} />
            </div>
        )
    }

    tasks() {
        return (
            <div className={'tasks box'}>
                <div className='title'>{t(this.props, 'activerecord.models.task.other')}</div>
                <TasksContainer tasks={this.props.account.tasks || []} userId={this.props.account.user_id} />
            </div>
        )
    }


    render() {
        let tabIndex = this.props.locales.length + this.props.baseTabIndex;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1>{t(this.props, `activerecord.models.user_account.one`)}</h1>
                    <div className='user-registration boxes'>
                        {this.roles()}
                        {this.tasks()}
                    </div>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
