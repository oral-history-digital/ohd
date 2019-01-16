import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

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
            this.props.fetchData('roles');
        }
    }

    render() {
        let _this = this;
        return (
            <div>
                <Form 
                    scope='user_role'
                    onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                    values={{
                        user_id: this.props.userRole && this.props.userRole.id,
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
