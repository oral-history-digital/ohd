import React from 'react';

export default class ChangePasswordForm extends React.Component {
    constructor(props, context) {
        super(props);
        this.state = {
            password: '',
            password_confirmation: '',
            //reset_password_token: this.context.router.route.match.params.resetPasswordToken
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
            this.props.submitChangePassword(this.state);
        } else {
            this.setErrors(); 
        }
    }

    valid() {
        return
            this.state.password &&
            this.state.password.length > 6 &&
            this.state.password_confirmation &&
            this.state.password_confirmation.length > 6 &&
            this.state.password_confirmation ===  this.state.password 
    }

    setErrors() {
        this.setState({ errors: "password has to have at least 6 chars" }) 
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
                        {'new password'}
                        <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <label>
                        {'confirm new password'}
                        <input type='password' name='password_confirmation' value={this.state.password_confirmation} onChange={this.handleChange} />
                    </label>
                    
                    <input type="submit" value="Change password" />
                </form>
            </div>
        );
    }
}
