import React from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash.groupby';

import { UserRolesContainer } from 'modules/roles';
import { TasksOnlyStatusEditableContainer } from 'modules/workflow';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { Features } from 'modules/features';
import { INDEX_ACCOUNT } from 'modules/flyout-tabs';
import { t } from 'modules/i18n';
import UserDetailsContainer from './UserDetailsContainer';

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

    componentDidMount() {
        this.props.setFlyoutTabsIndex(INDEX_ACCOUNT);
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

    groupedByProject(roles) {
        const groupedRoles = groupBy(roles, 'project_id');
        return Object.keys(groupedRoles).map(projectId => {
            return (
                <>
                    <h4>{this.props.projects[projectId].name[this.props.locale]}</h4>
                    <UserRolesContainer
                        userRoles={groupedRoles[projectId] || {}}
                        userAccountId={this.props.account.id}
                        hideEdit={true}
                        hideAdd={true}
                    />
                </>
            )
        })
    }

    roles() {
        const roles = this.props.account?.user_roles && Object.values(this.props.account.user_roles);
        if (roles?.length > 0) {
            return (
                <div className={'roles box'}>
                    <h3 className='title'>{t(this.props, 'activerecord.models.role.other')}</h3>
                    {this.groupedByProject(roles)}
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
        const { account } = this.props;

        return (
            <div className='wrapper-content register'>
                <AuthShowContainer ifLoggedIn={true} ifNoProject={true}>
                    <h1>{t(this.props, `activerecord.models.user_account.one`)}</h1>
                    <div className='user-registration boxes'>
                        {
                            account && <UserDetailsContainer />
                        }
                    </div>
                    <div className='user-registration boxes'>
                        {this.roles()}
                        {/* own tasks (not done)*/}
                        {this.tasks('other', account && Object.values(account.tasks).filter(t => t.workflow_state !== 'finished' && t.workflow_state !== 'cleared'))}
                        {/* own supervised tasks (not cleared)*/}
                        {this.tasks('supervised_other', account && Object.values(account.supervised_tasks).filter(t => t.workflow_state !== 'cleared'))}
                    </div>
                    <div className='user-registration boxes'>
                        {/* own tasks (done)*/}
                        {this.tasks('closed_other', account && Object.values(account.tasks).filter(t => t.workflow_state === 'finished' || t.workflow_state === 'cleared'), false)}
                        {/* own supervised tasks (cleared)*/}
                        {this.tasks('closed_supervised_other', account && Object.values(account.supervised_tasks).filter(t => t.workflow_state === 'cleared'))}
                    </div>

                    <AuthorizedContent object={{type: 'General'}} action='edit'>
                        <Features />
                    </AuthorizedContent>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        );
    }
}

WrappedAccount.propTypes = {
    account: PropTypes.object,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
