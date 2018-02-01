import React from 'react';
import PropTypes from 'prop-types';
import InputContainer from '../containers/form/InputContainer';
import queryString from 'query-string';
import { t } from '../../../lib/utils';

export default class ChangePasswordForm extends React.Component {

    static contextTypes = {
        router: PropTypes.object
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
            if(!resetToken) {
                let query = queryString.parse(this.context.router.route.location.search);
                resetToken = query.reset_password_token;
            }
            let url, method;
            let params = this.state.values;

            if (this.props.account.active) {
                url = `/de/user_registrations/${resetToken}/confirm`;
                method = 'post';
            } else {
                url = '/de/user_accounts/password';
                method = 'put';
                params.reset_password_token = resetToken;
            }
            this.props.submitChangePassword(url, method, {user_account: params});
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

    header() {
        if (this.props.account.active) {
            return (
                <h1>
                    {t(this.props, 'devise.registrations.activate')}
                    &nbsp;
                    <em>{this.texts().display_name}</em>
                </h1>
            );
        } else {
            return null;
        }
    }

    userSalutation() {
        if (this.props.account.active) {
            return (
                <span>
                    <label>
                        {t(this.props, 'devise.authentication_keys.login') + ": "}
                        <b>{this.texts().accountLogin}</b> 
                    </label>
                </span>
            );
        } else {
            return null;
        }
    }

    render() {
        let _this = this;
        return (
            <div>
                {this.header()}
                <p>
                    {t(this.props, 'devise.registrations.activate_text')}
                </p>
                {this.userSalutation()}

                <form className='default' onSubmit={this.handleSubmit}>
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
