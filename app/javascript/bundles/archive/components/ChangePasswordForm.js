import React from 'react';

export default class ChangePasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
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
            this.props.login(this.state);
        } else {
            this.setErrors(); 
        }
    }

    valid() {
        return this.state.oldPassword &&
            this.state.oldPassword.length > 6 && 
            this.state.newPassword &&
            this.state.newPassword.length > 6 &&
            this.state.confirmNewPassword &&
            this.state.confirmNewPassword.length > 6 &&
            this.state.confirmNewPassword ===  this.state.newPassword 
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
                        old password
                        <input type='password' name='old_password' value={this.state.oldPassword} onChange={this.handleChange} />
                    </label>
                    <label>
                        {'new password'}
                        <input type='password' name='new_password' value={this.state.newPassword} onChange={this.handleChange} />
                    </label>
                    <label>
                        {'confirm new password'}
                        <input type='password' name='confirm_new_password' value={this.state.confirmNewPassword} onChange={this.handleChange} />
                    </label>
                    
                    <input type="submit" value="Change password" />
                </form>
            </div>
        );
    }
}
