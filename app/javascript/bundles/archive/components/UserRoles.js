import React from 'react';

import UserRoleContainer from '../containers/UserRoleContainer';
import UserRoleFormContainer from '../containers/UserRoleFormContainer';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';

export default class UserRoles extends React.Component {

    userRoles() {
        return Object.keys(this.props.userRoles).map((id, index) => {
            return (
                <li key={`user-role-li-${id}`}>
                    <UserRoleContainer
                        userRole={this.props.userRoles[id]}
                        key={`userRole-${id}`}
                        hideEdit={this.props.hideEdit}
                    />
                </li>
            )
        })
    }

    addUserRole() {
        if (
            admin(this.props, {type: 'UserRole', action: 'create'}) &&
            !this.props.hideAdd
        ) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.user_role.new')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.user_role.new'),
                        content: <UserRoleFormContainer
                                    userAccountId={this.props.userAccountId}
                                />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <ul className={'user-roles'}>
                    {this.userRoles()}
                </ul>
                {this.addUserRole()}
            </div>
        )
    }
}
