import React from 'react';

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            password_confirmation: ''
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
            this.props.submitRegister(this.state);
        } else {
            this.setErrors(); 
        }
    }

    valid() {
        return this.state.email &&
            this.state.email.length > 6 && 
            this.state.password &&
            this.state.password.length > 6 &&
            this.state.password_confirmation &&
            this.state.password_confirmation.length > 6 &&
            this.state.password_confirmation ===  this.state.password 
    }

    setErrors() {
        this.setState({ errors: "Please give your email and password." })
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
                        email
                        <input type="text" name='email' value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <label>
                        password
                        <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <label>
                        {'confirm password'}
                        <input type='password' name='password_confirmation' value={this.state.password_confirmation} onChange={this.handleChange} />
                    </label>
                    
                    <input type="submit" value="Register" />
                </form>
            </div>
        );
    }
}
