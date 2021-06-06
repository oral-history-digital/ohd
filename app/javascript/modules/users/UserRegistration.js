import { Component } from 'react';
import PropTypes from 'prop-types';

import { TasksContainer } from 'modules/workflow';
import { Modal } from 'modules/ui';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { UserRolesContainer } from 'modules/roles';
import UserRegistrationProjectFormContainer from './UserRegistrationProjectFormContainer';

export default class UserRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: {
                roles: false,
                tasks: false
            }
        };
    }

    toggle(that) {
        return (
            <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, this.state.show[that] ? 'show' : 'hide')}
                onClick={() => this.setState({show: Object.assign({}, this.state.show, {[that]: !this.state.show[that]})})}
            >
                <i className={`fa fa-angle-${this.state.show[that] ? 'up' : 'down'}`}></i>
            </span>
        )
    }

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
                        'workflow_state'
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
        if (this.props.userRegistration.user_account_id) {
            const userRegistrationProject = Object.values(this.props.userRegistration.user_registration_projects).find(urp => urp.project_id === this.props.project.id)
            return (
                <Modal
                    title={t(this.props, 'edit.user_registration.edit')}
                    trigger={<i className="fa fa-pencil"/>}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <div>
                            {this.details()}
                            <UserRegistrationProjectFormContainer
                                userRegistrationProject={userRegistrationProject}
                                onSubmit={close}
                            />
                        </div>
                    )}
                </Modal>
            );
        }
    }

    buttons() {
        if (admin(this.props, {type: 'UserRegistration'}, 'update')) {
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
            admin(this.props, {type: 'UserRole'}, 'create')
        ) {
            const roles = Object.values(this.props.userRegistration.user_roles).filter(u => u.project_id === this.props.project.id) || [];
            return (
                <div className={'roles box'}>
                    <h4 className='title'>{roles.length + ' ' + t(this.props, `activerecord.models.role.other`)}{this.toggle('roles')}</h4>
                    {this.state.show.roles &&
                        <UserRolesContainer
                            userRoles={roles}
                            userAccountId={this.props.userRegistration.user_account_id}
                            hideEdit={false}
                        />
                    }
                </div>
            )
        } else {
            return <div className={'roles box'} />;
        }
    }

    tasks() {
        if (
            this.props.userRegistration.user_account_id &&
            admin(this.props, {type: 'Task'}, 'create')
        ) {
            const user_tasks = Object.values(this.props.userRegistration.tasks).filter(t => t.project_id === this.props.project.id);
            return (
                <div className={'tasks box'}>
                    <h4 className='title'>{user_tasks.length + ' ' + t(this.props, `activerecord.models.task.other`)}{this.toggle('tasks')}</h4>
                    {this.state.show.tasks &&
                        <TasksContainer
                            data={user_tasks}
                            initialFormValues={{user_account_id: this.props.userRegistration.user_account_id}}
                            hideEdit={true}
                            hideDelete={true}
                            hideAdd={true}
                        />
                    }
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

UserRegistration.propTypes = {
    userRegistration: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
};
