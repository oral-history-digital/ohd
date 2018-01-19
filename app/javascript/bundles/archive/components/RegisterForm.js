import React from 'react';
import Input from './form/Input';
import SelectContainer from '../containers/form/SelectContainer';
import { t } from '../../../lib/utils';

export default class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            values: {},
            errors: {
                // every mandatory field has to be listed here 
                // with errors true
                appellation: true,
                first_name: true,
                //last_name: true,
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
                    />
                    <SelectContainer
                        scope='user_registration' 
                        attribute='appellation' 
                        values={['ms', 'ms_dr', 'ms_prof', 'mr', 'mr_dr', 'mr_prof']}
                        withEmpty={true}
                        validate={function(v){return v !== ''}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <input type="submit" value={t(this.props, 'user_registration.register')}/>
                </form>
            </div>
        );
    }
}
