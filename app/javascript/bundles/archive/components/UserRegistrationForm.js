import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class UserRegistrationForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='user_registration'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                values={{
                    id: this.props.userRegistration && this.props.userRegistration.id,
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
                        label: t(this.props, 'activerecord.attributes.user_registration.transition_to'),
                        values: this.props.userRegistration && Object.values(this.props.userRegistration.transitions_to),
                        optionsScope: 'workflow_states',
                        withEmpty: true,
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
