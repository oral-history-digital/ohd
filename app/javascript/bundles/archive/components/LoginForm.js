import React from 'react';
import ArchiveUtils from '../../../lib/utils';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            rememberMe: 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({[name]: value});
        if (this.valid()) {
            this.clearErrors();
        }
    }


    handleSubmit(event) {
        event.preventDefault();
        if (this.valid()) {
            this.props.submitLogin({user_account: this.state});
        } else {
            this.setErrors();
        }
    }

    valid() {
        return this.state.login &&
            this.state.login.length > 6 &&
            this.state.password &&
            this.state.password.length > 6
    }

    setErrors() {
        this.setState({errors: ArchiveUtils.translate(this.props, 'login_errors')})
    }

    clearErrors() {
        this.setState({errors: undefined})
    }

    render() {
        let submitLabel = ArchiveUtils.translate(this.props, 'login') ? ArchiveUtils.translate(this.props, 'login') : "";
        return (
            <div>
                <div className='errors'>{this.state.errors}</div>
                <form className={'default flyout-login'} onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label>
                            {ArchiveUtils.translate(this.props, 'login')}
                        </label>
                        <input type="text" name='login' value={this.state.login} onChange={this.handleChange}/>
                    </div>
                    <div className='form-group'>
                        <label>
                            {ArchiveUtils.translate(this.props, 'password')}
                        </label>
                        <input type='password' name='password' value={this.state.password} onChange={this.handleChange}/>
                    </div>
                    {/*<div className='form-group'>*/}
                        {/*<label>*/}
                            {/*{ArchiveUtils.translate(this.props, 'remember')}*/}
                        {/*</label>*/}
                        {/*<input type='checkbox' name='remember_me' value={this.state.rememberMe} onChange={this.handleChange}/>*/}
                    {/*</div>*/}
                    <input type="submit" value={submitLabel}/>
                </form>
            </div>
        );
    }
}
