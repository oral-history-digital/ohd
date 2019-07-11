import React from 'react';
import PropTypes from 'prop-types';
import InputContainer from '../containers/form/InputContainer';
import { t } from '../../../lib/utils';

export default class OrderNewPasswordForm extends React.Component {

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props, context) {
        super(props);
        this.state = {
            showErrors: false, 
            values: {
                email: this.props.account.email && this.props.account.email.includes('@') ? this.props.account.email : null
            },
            errors: {
                email: !(this.props.account.email && this.props.account.email.includes('@'))
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(name, value) {
        this.setState({ 
            values: Object.assign({}, this.state.values, {[name]: value})
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.valid()) {
            this.props.submitOrderNewPassword({user_account: this.state.values});
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
        return (
            <form className='default' onSubmit={this.handleSubmit}>
                <InputContainer 
                    scope='user_registration' 
                    attribute='email' 
                    value={this.props.account.email && this.props.account.email.includes('@') ? this.props.account.email : ''}
                    type='text' 
                    showErrors={this.state.showErrors}
                    validate={function(v){return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)}} 
                    handleChange={this.handleChange}
                    handleErrors={this.handleErrors}
                />
                <input type="submit" value={t(this.props, 'devise.registrations.activate_submit')}/>
            </form>
        );
    }
}
