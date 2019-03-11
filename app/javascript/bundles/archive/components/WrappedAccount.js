import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import TasksContainer from '../containers/TasksContainer';
import TasksOnlyStatusEditableContainer from '../containers/TasksOnlyStatusEditableContainer';
import UserRolesContainer from '../containers/UserRolesContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t, admin, pluralize } from '../../../lib/utils';

export default class WrappedAccount extends React.Component {

    constructor(props) {
        super(props);
        //this.form = this.form.bind(this);
    }

    details() {
        return (
            <div className='details box'>
                {['first_name', 'last_name', 'email'].map((detail, index) => {
                        return (
                            <p className='detail'>
                                <span className='name'>{t(this.props, `activerecord.attributes.account.${detail}`) + ': '}</span>
                                <span className='content'>{this.props.account[detail]}</span>
                            </p>
                        )
                })}
            </div>
        )
    }

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.account.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.account.edit'),
                    content: this.form()
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    form() {
        let _this = this;
        return (
            <Form 
                data={this.props.account}
                scope='account'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                submitText='submit'
                elements={[
                    {
                        attribute: 'first_name',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        attribute: 'last_name',
                        validate: function(v){return v.length > 1} 
                    },
                ]}
            />
        );
    }

    buttons() {
        return (
            <div className={'buttons box'}>
                {this.edit()}
            </div>
        )
    }

    roles() {
        return (
            <div className={'roles box'}>
                <h4 className='title'>{t(this.props, 'activerecord.models.role.other')}</h4>
                <UserRolesContainer 
                    userRoles={this.props.account.user_roles || []} 
                    userId={this.props.account.user_id} 
                    hideEdit={true}
                    hideAdd={true}
                />
            </div>
        )
    }

    tasks() {
        return (
            <div className={'tasks box'}>
                <h4 className='title'>{t(this.props, 'activerecord.models.task.other')}</h4>
                <TasksOnlyStatusEditableContainer 
                    data={this.props.account.tasks || []} 
                    initialFormValues={{user_id: this.props.account.user_id}} 
                    hideEdit={false}
                    hideDelete={true}
                    hideAdd={true}
                />
            </div>
        )
    }

    supervisedTasks() {
        return (
            <div className={'tasks box'}>
                <h4 className='title'>{t(this.props, 'activerecord.models.task.supervised_other')}</h4>
                <TasksContainer 
                    data={this.props.account.supervised_tasks || []} 
                    initialFormValues={{user_id: this.props.account.user_id}} 
                    hideEdit={false}
                    hideAdd={true}
                    hideDelete={true}
                />
            </div>
        )
    }



    render() {
        return (
            <WrapperPageContainer tabIndex={1}>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1>{t(this.props, `activerecord.models.user_account.one`)}</h1>
                    <div className='user-registration boxes'>
                        {this.details()}
                        {this.buttons()}
                    </div>
                    <div className='user-registration boxes'>
                        {this.roles()}
                        {this.tasks()}
                        {this.supervisedTasks()}
                    </div>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
