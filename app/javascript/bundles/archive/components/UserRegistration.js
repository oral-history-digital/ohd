import React from 'react';

import UserRegistrationFormContainer from '../containers/UserRegistrationFormContainer';
import { t, fullname, admin } from '../../../lib/utils';

export default class UserRegistration extends React.Component {

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
                        'research_intention',
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

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.user_registration.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.user_registration.edit'),
                    content: [this.details(), <UserRegistrationFormContainer userRegistration={this.props.userRegistration} />]
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    buttons() {
        if (admin(this.props)) {
            return (
                <span className={'buttons'}>
                    {this.edit()}
                </span>
            )
        }
    }

    render() {
        if (this.props.userRegistration) {
            return (
                <div className='user-registration'>
                    <p className='name'>{`${this.props.userRegistration.first_name} ${this.props.userRegistration.last_name}`}</p>
                    <p className='created-at'>
                        <span className='title'>{t(this.props, 'activerecord.attributes.user_registration.created_at') + ': '}</span>
                        <span className='content'>{`${this.props.userRegistration.created_at}`}</span>
                    </p>
                    <p className='workflow-state'>
                        <span className='title'>{t(this.props, 'activerecord.attributes.user_registration.workflow_state') + ': '}</span>
                        <span className='content'>{`${this.props.userRegistration.workflow_state}`}</span>
                    </p>
                    {this.buttons()}
                </div>
            )
        } else {
            return null;
        }
    }
}

