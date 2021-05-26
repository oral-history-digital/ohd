import { Component } from 'react';

import { Form } from 'modules/forms';
import { pathBase } from 'modules/routes';

export default class LoginForm extends Component {
    render() {
        return (
            <Form
                scope='user_account'
                onSubmit={(params) => {
                    const url = `${pathBase(this.props)}/user_accounts/sign_in`;
                    this.props.submitLogin(url, params);
                }}
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
