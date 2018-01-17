import React from 'react';
import ArchiveUtils from '../../../lib/utils';

export default class ChangePasswordForm extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    constructor(props, context) {
        super(props);
        this.state = {
            password: '',
            password_confirmation: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account.email && !this.props.account.email) {
            this.context.router.history.push(`/${this.props.locale}/searches/archive`);
        }
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
            let resetToken = this.context.router.route.match.params.resetPasswordToken;
            this.props.submitChangePassword({user_account: this.state}, resetToken);
        } else {
            this.setErrors(); 
        }
    }

    valid() {
        let correct = 
            this.state.password &&
            this.state.password.length > 6 &&
            this.state.password_confirmation &&
            this.state.password_confirmation.length > 6 &&
            this.state.password_confirmation ===  this.state.password 
        
        return correct;
    }

    setErrors() {
        this.setState({errors: ArchiveUtils.translate(this.props, 'account_activation_errors')});
    }

    clearErrors() {
        this.setState({ errors: undefined })
    }

    texts() {
        let t = {}
        try {
            t.activate = ArchiveUtils.translate(this.props, 'devise').registrations.activate;
            t.display_name = this.props.account.display_name;
            t.activate_text = ArchiveUtils.translate(this.props, 'devise').registrations.activate_text;
            t.login = ArchiveUtils.translate(this.props, 'devise').authentication_keys.login + ": ";
            t.accountLogin = this.props.account.login;
            t.password = ArchiveUtils.translate(this.props, 'devise').passwords.password;
            t.passwordConfirmation = ArchiveUtils.translate(this.props, 'devise').passwords.password_confirmation;
            t.submit = ArchiveUtils.translate(this.props, 'devise').registrations.activate_submit;
        } catch(e) {
        } finally {
            return t;
        }
    }

    render() {
        let submit = this.texts().submit || '';
        return (
            <div>
                <h1>
                    {this.texts().activate}
                    &nbsp;
                    <em>{this.texts().display_name}</em>
                </h1>
                <p>
                    {this.texts().activate_text}
                </p>
                <div className='errors'>{this.state.errors}</div>
                <form onSubmit={this.handleSubmit}>
                    <span>
                        <label>
                            {this.texts().login}
                            <b>{this.texts().accountLogin}</b> 
                        </label>
                    </span>
                    <span>&nbsp;</span>
                    <label>
                        {this.texts().password}
                        <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <span>&nbsp;</span>
                    <label>
                        {this.texts().passwordConfirmation}
                        <input type='password' name='password_confirmation' value={this.state.password_confirmation} onChange={this.handleChange} />
                    </label>
                    
                    <input type="submit" value={submit}/>
                </form>
            </div>
        );
    }
}
