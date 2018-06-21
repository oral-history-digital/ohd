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
                        type: 'email',
                        validate: function(v){return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)}
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
