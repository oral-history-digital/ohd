import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class LoginForm extends React.Component {

    render() {
        return (
            <Form 
                scope='user_account'
                onSubmit={this.props.submitLogin}
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
