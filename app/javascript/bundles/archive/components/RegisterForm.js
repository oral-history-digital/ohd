import React from 'react';
import Input from './form/Input';
import Select from './form/Select';

export default class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            values: {},
            errors: {
                // every mandatory field has to be listed here 
                // with errors true
                first_name: true,
                //last_name: true,
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.textMethod = this.textMethod.bind(this);
    }

    handleChange(name, value) {
        this.setState({ 
            values: Object.assign({}, this.state.values, {[name]: value})
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.valid()) {
            this.props.submitRegister({user_registration: this.state.values});
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
        return !errors;
    }

    textMethod(scope, value, error=false) {
        let text;
        let scopeE = error ? scope + '_errors' : scope;
        try{
            text = this.props.translations[this.props.locale][scopeE][value];
        } catch(e) {
            text = `translation for ${this.props.locale}.${scopeE}.${value} is missing!`;
        } finally {
            return text;
        }
    }

    render() {
        return (
            <div>
                <form id='new_user_registration' className='user_registration' onSubmit={this.handleSubmit}>
                    <Input 
                        scope='user_registration' 
                        attribute='first_name' 
                        type='text' 
                        validate={function(v){return v.length > 1}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                        textMethod={this.textMethod}
                    />
                    <input type="submit" value={this.textMethod('user_registration', 'register')}/>
                </form>
            </div>
        );
    }
}
