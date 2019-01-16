import React from 'react';

import UserRoleContainer from '../containers/UserRoleContainer';
import UserRoleFormContainer from '../containers/UserRoleFormContainer';
import { t, admin } from '../../../lib/utils';

export default class UserRoles extends React.Component {

    userRoles() {
        return Object.keys(this.props.userRoles).map((id, index) => {
            return (
                <li key={`user-role-li-${id}`}>
                    <UserRoleContainer 
                        userRole={userRole} 
                        key={`userRole-${id}`} 
                    />
                </li>
            )
        })
    }

    addUserRole() {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.user_role.new')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.user_role.new'),
                        content: <UserRoleFormContainer 
                                    userId={this.props.userId}
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

