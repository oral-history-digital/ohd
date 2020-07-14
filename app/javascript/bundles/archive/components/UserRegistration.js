import React from 'react';

import UserRegistrationFormContainer from '../containers/UserRegistrationFormContainer';
import TasksContainer from '../containers/TasksContainer';
import UserRolesContainer from '../containers/UserRolesContainer';
import { t, fullname, admin } from '../../../lib/utils';

export default class UserRegistration extends React.Component {

    baseData() {
        return (
            <div className='user-base-data box'>
                <p className='name'>{`${this.props.userRegistration.first_name} ${this.props.userRegistration.last_name}`}</p>
                <p className='created-at'>
                    <span className='title'>{t(this.props, 'activerecord.attributes.user_registration.created_at') + ': '}</span>
                    <span className='content'>{`${this.props.userRegistration.created_at}`}</span>
                </p>
                <p className='workflow-state'>
                    <span className='title'>{t(this.props, 'activerecord.attributes.user_registration.workflow_state') + ': '}</span>
                    <span className='content'>{t(this.props,`workflow_states.${this.props.userRegistration.workflow_state}`)}</span>
                </p>
            </div>
        )
    }

    details() {
        return (
            <div className='details'>
                {
                    [
                        'appellation',
                        'first_name',
                        'last_name',
                        'email',
                        'gender',
                        'job_description',
                        'research_intentions',
                        'comments',
                        'organization',
                        'homepage',
                        'street',
                        'zipcode',
                        'city',
                        'country',
                        'created_at',
                        'activated_at',
                        'processed_at',
                        'default_locale',
                        'receive_newsletter',
                    ].map((detail, index) => {
                        return (
                            <p className="detail"
                               key={index}
                              >
                                <span className='name'>{t(this.props, `activerecord.attributes.user_registration.${detail}`) + ': '}</span>
                                <span className='content'>{this.props.userRegistration[detail]}</span>
                            </p>
                        )
                    })
                }
            </div>
        )
    }

    show() {
        if (this.props.userRegistration.workflow_state != 'account_created') {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.user_registration.edit')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.user_registration.edit'),
                        content: <div>{this.details()}<UserRegistrationFormContainer userRegistration={this.props.userRegistration} /></div>
                    })}
                >
                    <i className="fa fa-pencil"></i>
                </div>
            )
        }
    }

    // edit() {
    //     return (
    //         <div
    //             className='flyout-sub-tabs-content-ico-link'
    //             title={t(this.props, 'edit.user_registration.edit')}
    //             onClick={() => this.props.openArchivePopup({
    //                 title: t(this.props, 'edit.user_registration.edit'),
    //                 content: <div>{this.details()}<UserRegistrationFormContainer userRegistration={this.props.userRegistration} /></div>
    //             })}
    //         >
    //             <i className="fa fa-pencil"></i>
    //         </div>
    //     )
    // }

    buttons() {
        if (admin(this.props, {type: 'UserRegistration', action: 'update'})) {
            return (
                <div className={'buttons box'}>
                    {this.show()}
                    {/* {this.edit()} */}
                </div>
            )
        }
    }

    roles() {
        if (
            this.props.userRegistration.user_account_id &&
            admin(this.props, {type: 'UserRole', action: 'create'})
        ) {
            return (
                <div className={'roles box'}>
                    <div className='title'>{t(this.props, 'activerecord.models.role.other')}</div>
                    <UserRolesContainer
                        userRoles={this.props.userRegistration.user_roles || []}
                        userAccountId={this.props.userRegistration.user_account_id}
                        hideEdit={false}
                    />
                </div>
            )
        } else {
            return <div className={'roles box'} />;
        }
    }

    tasks() {
        if (
            this.props.userRegistration.user_account_id &&
            admin(this.props, {type: 'Task', action: 'create'})
        ) {
            return (
                <div className={'tasks box'}>
                    <div className='title'>{t(this.props, 'activerecord.models.task.other')}</div>
                    <TasksContainer
                        data={this.props.userRegistration.tasks}
                        initialFormValues={{user_account_id: this.props.userRegistration.user_account_id}}
                        hideEdit={false}
                    />
                </div>
            )
        } else {
            return <div className={'tasks box'} />;
        }
    }

    render() {
        if (this.props.userRegistration) {
            return (
                <div className='user-registration boxes'>
                    {this.baseData()}
                    {this.buttons()}
                    {this.roles()}
                    {this.tasks()}
                </div>
            )
        } else {
            return null;
        }
    }
}
