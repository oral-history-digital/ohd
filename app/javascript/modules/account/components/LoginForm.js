import React from 'react';

import { Form } from 'modules/forms';
import { pathBase } from 'lib/utils';

export default class LoginForm extends React.Component {
    render() {
        let _this = this;
        return (
            <Form
                scope='user_account'
                onSubmit={function(params){_this.props.submitLogin(`${pathBase(_this.props)}/user_accounts/sign_in`, params)}}
                submitText='login'
                elements={[
                    {
                        attribute: 'login',
                        elementType: 'input',
                        type: 'text',
                        // validate: function(v){return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)}
                    },
                    {
                        attribute: 'password',
                        elementType: 'input',
                        type: 'password',
                        validate: function(v){return v && v.length > 6}
                    },
                ]}
            />
        )
    }
}
