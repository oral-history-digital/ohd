import React from 'react';
import TasksOnlyStatusEditableContainer from '../containers/TasksOnlyStatusEditableContainer';
import UserRolesContainer from '../containers/UserRolesContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class WrappedAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showTasks: {
                other: false,
                supervised_other: false,
                closed_other: false,
                closed_supervised_other: false,
            }
        };
    }

    toggleTasks(header) {
        return (
            <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, this.state.showTasks[header] ? 'show' : 'hide')}
                onClick={() => this.setState({showTasks: Object.assign({}, this.state.showTasks, {[header]: !this.state.showTasks[header]})})}
            >
                <i className={`fa fa-angle-${this.state.showTasks[header] ? 'up' : 'down'}`}></i>
            </span>
        )
    }

    details() {
        if (this.props.account) {
            return (
                <div className='details box'>
                    {['first_name', 'last_name', 'email'].map((detail, index) => {
                            return (
                                <p className='detail' key={`${detail}-detail`}>
                                    <span className='name'>{t(this.props, `activerecord.attributes.account.${detail}`) + ': '}</span>
                                    <span className='content'>{this.props.account[detail]}</span>
                                </p>
                            )
                    })}
                </div>
            )
        } else {
            return null;
        }
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
                onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
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
                    {
                        attribute: 'email',
                        elementType: 'input',
                        type: 'email',
                        validate: function(v){return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)}
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
        if (this.props.account && this.props.account.user_roles && Object.keys(this.props.account.user_roles).length > 0) {
            return (
                <div className={'roles box'}>
                    <h4 className='title'>{t(this.props, 'activerecord.models.role.other')}</h4>
                    <UserRolesContainer
                        userRoles={this.props.account.user_roles || {}}
                        userAccountId={this.props.account.id}
                        hideEdit={true}
                        hideAdd={true}
                    />
                </div>
            )
        } else {
            return null;
        }
    }

    tasks(header, data, hideShow=true) {
        if (data) {
            var hidden = data.length === 0 ? 'hidden' : ''
            return (
                <div className={`tasks box ${hidden}`}>
                    <h4 className='title'>{data.length + ' ' + t(this.props, `activerecord.models.task.${header}`)}{this.toggleTasks(header)}</h4>
                    {this.state.showTasks[header] &&
                        <TasksOnlyStatusEditableContainer
                            data={data || {}}
                            initialFormValues={{user_account_id: this.props.account.id}}
                            hideShow={hideShow}
                            hideEdit={!hideShow}
                            hideDelete={true}
                            hideAdd={true}
                        />
                    }
                </div>
            )
        }
    }

    render() {
        return (
            <div className='wrapper-content register'>
                <AuthShowContainer ifLoggedIn={true} ifNoProject={true}>
                    <h1>{t(this.props, `activerecord.models.user_account.one`)}</h1>
                    <div className='user-registration boxes'>
                        {this.details()}
                        {this.buttons()}
                    </div>
                    <div className='user-registration boxes'>
                        {this.roles()}
                        {/* own tasks (not done)*/}
                        {this.tasks('other', this.props.account && Object.values(this.props.account.tasks).filter(t => t.workflow_state !== 'finished' && t.workflow_state !== 'cleared'))}
                        {/* own supervised tasks (not cleared)*/}
                        {this.tasks('supervised_other', this.props.account && Object.values(this.props.account.supervised_tasks).filter(t => t.workflow_state !== 'cleared'))}
                    </div>
                    <div className='user-registration boxes'>
                        {/* own tasks (done)*/}
                        {this.tasks('closed_other', this.props.account && Object.values(this.props.account.tasks).filter(t => t.workflow_state === 'finished' || t.workflow_state === 'cleared'), false)}
                        {/* own supervised tasks (cleared)*/}
                        {this.tasks('closed_supervised_other', this.props.account && Object.values(this.props.account.supervised_tasks).filter(t => t.workflow_state === 'cleared'))}
                    </div>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        );
    }
}
