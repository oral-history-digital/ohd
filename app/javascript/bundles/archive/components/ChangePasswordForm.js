import React from 'react';
import InputContainer from '../containers/form/InputContainer';
import { t } from '../../../lib/utils';

export default class ChangePasswordForm extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    constructor(props, context) {
        super(props);
        this.state = {
            showErrors: false, 
            values: {
            },
            errors: {
                password: true,
                password_confirmation: true,
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account.email && !this.props.account.email) {
            this.context.router.history.push(`/${this.props.locale}/searches/archive`);
        }
    }

    handleChange(name, value) {
        this.setState({ 
            values: Object.assign({}, this.state.values, {[name]: value})
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.valid()) {
            let resetToken = this.context.router.route.match.params.resetPasswordToken;
            this.props.submitChangePassword({user_account: this.state.values}, resetToken);
        } 
    }

    handleErrors(name, bool) {
        this.setState({ 
            errors: Object.assign({}, this.state.errors, {[name]: bool})
        })
    }

    valid() {
        let errors = false;
        Object.keys(this.state.errors).map((name, index) => {
            errors = this.state.errors[name] || errors;
        })
        this.setState({showErrors: errors});
        return !errors;
    }

    texts() {
        let t = {}
        try {
            t.display_name = this.props.account.display_name;
            t.accountLogin = this.props.account.login;
        } catch(e) {
        } finally {
            return t;
        }
    }

    render() {
        let submit = this.texts().submit || '';
        let _this = this;
        return (
            <div>
                <h1>
                    {t(this.props, 'devise.registrations.activate')}
                    &nbsp;
                    <em>{this.texts().display_name}</em>
                </h1>
                <p>
                    {t(this.props, 'devise.registrations.activate_text')}
                </p>

                <form className='default' onSubmit={this.handleSubmit}>
                    <span>
                        <label>
                            {t(this.props, 'devise.authentication_keys.login') + ": "}
                            <b>{this.texts().accountLogin}</b> 
                        </label>
                    </span>
                    <span>&nbsp;</span>
                    <InputContainer 
                        scope='devise.passwords'
                        attribute='password' 
                        type='password' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v.length > 6}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <InputContainer 
                        scope='devise.passwords'
                        attribute='password_confirmation' 
                        type='password' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v.length > 6 && v === _this.state.values.password}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    
                    <input type="submit" value={t(this.props, 'devise.registrations.activate_submit')}/>
                </form>
            </div>
        );
    }
}
