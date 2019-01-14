import React from 'react';
import PropTypes from 'prop-types';
import spinnerSrc from '../../../images/large_spinner.gif'
import { t } from '../../../lib/utils';


export default class UserRegistrationSearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        this.getDataForQuery();
    }


    getDataForQuery() {
        if (
            !this.props.isUserRegistrationSearching
        ) {
            let url = `/${this.context.router.route.match.params.locale}/user_registrations`;
            this.props.searchUserRegistration(url, this.props.query);
        }
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.props.setUserRegistrationQueryParams({[name]: value});
    }

    handleReset(event) {
        this.form.reset();
        this.props.resetUserRegistrationQuery();
        this.props.fetchData('user_registrations', null, null, this.props.locale, `workflow_state=${'unchecked'}`);
    }

    handleSubmit(event) {
        if (event !== undefined) event.preventDefault();
        this.getDataForQuery();
    }

    workflowStateOptions() {
        return ['all', 'unchecked', 'checked', 'registered', 'postponed', 'rejected'].map((value, index) => {
            let text = t(this.props, `workflow_states.${value}`);
            return (
                <option value={value} key={`userRegistration-workflowState-${index}`}>
                    {text}
                </option>
            )
        })
    }

    render() {
        let _this = this;
        return (
            <div>
                <form 
                    ref={(form) => { this.form = form; }} 
                    id="userRegistrationSearchForm" 
                    className={'flyout-search'} 
                    onSubmit={this.handleSubmit}
                >
                    <input 
                        className="search-input" 
                        type="text" 
                        name="first_name" 
                        value={this.props.query.first_name}
                        onChange={this.handleChange}
                    />
                    <input 
                        className="search-input" 
                        type="text" 
                        name="last_name" 
                        value={this.props.query.last_name}
                        onChange={this.handleChange}
                    />
                    <select 
                        className="search-input" 
                        name="workflow_state" 
                        value={this.props.query.workflow_state}
                        onChange={this.handleChange}
                    >
                        {this.workflowStateOptions()}
                    </select>
                    <input 
                        className="search-button" 
                        id="search-button"
                        title={t(this.props, 'search')} 
                        type="submit" 
                        value=""
                    />
                </form>
                <button 
                    className={'reset'}
                    onClick={this.handleReset}>{t(this.props, 'reset')}
                </button>
            </div>
        );
    }

    static contextTypes = {
        router: PropTypes.object
    }
}
