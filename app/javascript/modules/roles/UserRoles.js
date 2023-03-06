import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';
import UserRoleFormContainer from './UserRoleFormContainer';
import UserRoleContainer from './UserRoleContainer';

export default class UserRoles extends Component {
    userRoles() {
        return Object.keys(this.props.userRoles).map((id) => {
            return (
                <li
                    key={`user-role-li-${id}`}
                    className="DetailList-item"
                >
                    <UserRoleContainer
                        userRole={this.props.userRoles[id]}
                        userRegistrationId={this.props.userRegistrationId}
                        key={`userRole-${id}`}
                        hideEdit={this.props.hideEdit}
                    />
                </li>
            )
        })
    }

    addUserRole() {
        if (
            admin(this.props, {type: 'UserRole'}, 'create') &&
            !this.props.hideAdd
        ) {
            return (
                <Modal
                    title={t(this.props, 'edit.user_role.new')}
                    trigger={<FaPlus className="Icon Icon--editorial" />}
                >
                    {closeModal => (
                        <UserRoleFormContainer
                            userAccountId={this.props.userAccountId}
                            userRegistrationId={this.props.userRegistrationId}
                            onSubmit={closeModal}
                        />
                    )}
                </Modal>
            )
        }
    }

    render() {
        return (
            <div>
                <ul className="DetailList">
                    {this.userRoles()}
                </ul>
                {this.addUserRole()}
            </div>
        )
    }
}

UserRoles.propTypes = {
    userRoles: PropTypes.object.isRequired,
    userAccountId: PropTypes.number.isRequired,
    hideAdd: PropTypes.bool,
    hideEdit: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
};
