import React from 'react';
import { Form } from 'modules/forms';
import { t } from 'modules/i18n';

export default class UserRoleForm extends React.Component {

    componentDidMount() {
        this.loadRoles();
    }

    componentDidUpdate() {
        this.loadRoles();
    }

    loadRoles() {
        if (
            !this.props.rolesStatus.all ||
            this.props.rolesStatus.all.split('-')[0] === 'reload'
        ) {
            this.props.fetchData(this.props, 'roles');
        }
    }

    render() {
        let _this = this;
        return (
            <div>
                <Form
                    scope='user_role'
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                    values={{
                        user_account_id: this.props.userAccountId,
                    }}
                    elements={[
                        {
                            elementType: 'select',
                            attribute: 'role_id',
                            values: this.props.roles,
                            withEmpty: true,
                            validate: function(v){return v !== ''}
                        },
                    ]}
                />
            </div>
        );
    }
}
