import React from 'react';

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
        const value =  event.target.value;
        const name =  event.target.name;

        this.setState({[name]: value});
        if(this.valid()) {
            this.clearErrors();
        }
    }


    handleSubmit(event) {
        event.preventDefault();
        if(this.valid()) {
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
        this.setState({ errors: "Please give your login and password." })
    }

    clearErrors() {
        this.setState({ errors: undefined })
    }

    render() {
        return (
            <div>
                <div className='errors'>{this.state.errors}</div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        login
                        <input type="text" name='login' value={this.state.login} onChange={this.handleChange} />
                    </label>
                    <label>
                        password
                        <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <label>
                        remember
                        <input type='checkbox' name='remember_me' value={this.state.rememberMe} onChange={this.handleChange} />
                    </label>
                    
                    <input type="submit" value="Login" />
                </form>
            </div>
        );
    }
}
