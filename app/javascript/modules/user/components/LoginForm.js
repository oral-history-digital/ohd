import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { useDispatch } from 'react-redux';

import { submitLogin } from '../actions';

export default function LoginForm() {
    const dispatch = useDispatch();
    const pathBase = usePathBase();

    return (
        <Form
            scope="user"
            onSubmit={(params) => {
                const url = `${pathBase}/users/sign_in`;
                dispatch(submitLogin(url, params));
            }}
            submitText="login"
            elements={[
                {
                    attribute: 'email',
                    elementType: 'input',
                    type: 'text',
                },
                {
                    attribute: 'password',
                    elementType: 'input',
                    type: 'password',
                },
            ]}
        />
    );
}
