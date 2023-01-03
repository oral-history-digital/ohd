import { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';

export default class UserRoleForm extends Component {
    componentDidMount() {
        this.loadRoles();
    }

    componentDidUpdate() {
        this.loadRoles();
    }

    loadRoles() {
        if (
            !this.props.rolesStatus[`for_projects_${this.props.project?.id}`] ||
            this.props.rolesStatus[`for_projects_${this.props.project?.id}`].split('-')[0] === 'reload'
        ) {
            this.props.fetchData(this.props, 'roles', null, null, `for_projects=${this.props.project?.id}`);
        }
    }

    render() {
        return (
            <div>
                <Form
                    scope='user_role'
                    onSubmit={(params) => { this.props.submitData(this.props, params); this.props.onSubmit(); }}
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
                    helpTextCode="user_role_form"
                />
            </div>
        );
    }
}

UserRoleForm.propTypes = {
    rolesStatus: PropTypes.object.isRequired,
    userAccountId: PropTypes.number.isRequired,
    roles: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
