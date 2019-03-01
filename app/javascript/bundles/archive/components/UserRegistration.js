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
                    <span className='content'>{`${this.props.userRegistration.workflow_state}`}</span>
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
                            <p className='detail'>
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
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.user_registration.show')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.user_registration.show'),
                    content: this.details()
                })}
            >
                <i className="fa fa-eye"></i>
            </div>
        )
    }

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.user_registration.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.user_registration.edit'),
                    content: <UserRegistrationFormContainer userRegistration={this.props.userRegistration} />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    buttons() {
        if (admin(this.props)) {
            return (
                <div className={'buttons box'}>
                    {this.show()}
                    {this.edit()}
                </div>
            )
        }
    }

    roles() {
        if (this.props.userRegistration.user_id) {
            return (
                <div className={'roles box'}>
                    <div className='title'>{t(this.props, 'activerecord.models.role.other')}</div>
                    <UserRolesContainer userRoles={this.props.userRegistration.roles} userId={this.props.userRegistration.user_id} />
                </div>
            )
        } else {
            return <div className={'roles box'} />;
        }
    }

    tasks() {
        if (this.props.userRegistration.user_id) {
            return (
                <div className={'tasks box'}>
                    <div className='title'>{t(this.props, 'activerecord.models.task.other')}</div>
                    <TasksContainer 
                        data={this.props.userRegistration.tasks} 
                        initialFormValues={{user_id: this.props.userRegistration.user_id}} 
                        hideEdit={true}
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

