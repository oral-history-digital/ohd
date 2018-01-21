import React from 'react';
import InputContainer from '../containers/form/InputContainer';
import TextareaContainer from '../containers/form/TextareaContainer';
import SelectContainer from '../containers/form/SelectContainer';
import { t } from '../../../lib/utils';

export default class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showErrors: false, 
            values: {},
            errors: {
                // every mandatory field has to be listed here 
                // with errors true
                appellation: true,
                first_name: true,
                last_name: true,
                email: true,
                research_intention: true,
                comments: true,
                street: true,
                zipcode: true,
                city: true,
                tos_agreement: true,
                priv_agreement: true,
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
        this.setState({showErrors: errors});
        return !errors;
    }

    render() {
        return (
            <div>
                <form id='new_user_registration' className='user_registration' onSubmit={this.handleSubmit}>
                    <SelectContainer
                        scope='user_registration' 
                        attribute='appellation' 
                        values={['ms', 'ms_dr', 'ms_prof', 'mr', 'mr_dr', 'mr_prof']}
                        withEmpty={true}
                        showErrors={this.state.showErrors}
                        validate={function(v){return v !== ''}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='first_name' 
                        type='text' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v.length > 1}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='last_name' 
                        type='text' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v.length > 1}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='email' 
                        type='text' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <SelectContainer
                        scope='user_registration' 
                        attribute='job_description' 
                        values={['researcher', 'filmmaker', 'journalist', 'teacher', 'memorial_staff', 'pupil', 'student', 'other']}
                        withEmpty={true}
                        handleChange={this.handleChange}
                    />
                    <SelectContainer
                        scope='user_registration' 
                        attribute='research_intention' 
                        values={['exhibition', 'education', 'film', 'genealogy', 'art', 'personal_interest', 'press_publishing', 'school_project', 'university_teaching', 'scientific_paper', 'other']}
                        withEmpty={true}
                        showErrors={this.state.showErrors}
                        validate={function(v){return v !== ''}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <TextareaContainer 
                        scope='user_registration' 
                        attribute='comments' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v.length > 10}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='organization' 
                        type='text' 
                        handleChange={this.handleChange}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='homepage' 
                        type='text' 
                        handleChange={this.handleChange}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='street' 
                        type='text' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v.length > 1}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='zipcode' 
                        type='text' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v.length > 1}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='city' 
                        type='text' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v.length > 1}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='receive_newsletter' 
                        type='checkbox' 
                        handleChange={this.handleChange}
                        help={t(this.props, 'user_registration.notes_on_receive_newsletter')}
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='tos_agreement' 
                        type='checkbox' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v !== false && v !== '0'}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                        help={
                            <a href="" target="_blank" title="Externer Link">
                                {t(this.props, 'user_registration.notes_on_tos_agreement')}
                            </a>
                        }
                    />
                    <InputContainer 
                        scope='user_registration' 
                        attribute='priv_agreement' 
                        type='checkbox' 
                        showErrors={this.state.showErrors}
                        validate={function(v){return v !== false && v !== '0'}} 
                        handleChange={this.handleChange}
                        handleErrors={this.handleErrors}
                        help={
                            <a href="" target="_blank" title="Externer Link">
                                {t(this.props, 'user_registration.notes_on_priv_agreement')}
                            </a>
                        }
                    />

                    <input type="submit" value={t(this.props, 'user_registration.register')}/>
                </form>
            </div>
        );
    }
}
