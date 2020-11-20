import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class UserRegistrationForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form
                scope='user_registration'
                onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                data={this.props.userRegistration}
                values={{
                    default_locale: this.props.locale
                }}
                submitText='submit'
                elements={[
                    //{
                        //elementType: 'input',
                        //attribute: 'first_name',
                        //value: this.props.userRegistration && this.props.userRegistration.first_name,
                        //type: 'text',
                        //validate: function(v){return v.length > 1}
                    //},
                    //{
                        //elementType: 'input',
                        //attribute: 'last_name',
                        //value: this.props.userRegistration && this.props.userRegistration.last_name,
                        //type: 'text',
                        //validate: function(v){return v.length > 1}
                    //},
                    {
                        elementType: 'select',
                        attribute: 'workflow_state',
                        values: this.props.userRegistration && Object.values(this.props.userRegistration.workflow_states),
                        value: this.props.userRegistration && this.props.userRegistration.workflow_state,
                        optionsScope: 'workflow_states',
                        withEmpty: true
                    },
                    {
                        elementType: 'textarea',
                        attribute: 'admin_comments',
                        value: this.props.userRegistration && this.props.userRegistration.admin_comments,
                    },
                ]}
            />
        );
    }
}
