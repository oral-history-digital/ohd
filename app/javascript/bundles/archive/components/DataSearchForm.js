import React from 'react';
import PropTypes from 'prop-types';
import spinnerSrc from '../../../images/large_spinner.gif'
import FormElement from './form/Element'
import { t, pluralize, parametrizedQuery } from '../../../lib/utils';


export default class DataSearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
         if (
            !this.props.dataStatus[this.statifiedQuery()]
         ) {
            this.props.fetchData(pluralize(this.props.scope), null, null, this.props.locale, parametrizedQuery(this.props.query));
         }
     }

    statifiedQuery() {
        return parametrizedQuery(this.props.query).replace(/[=&]/g, '_');
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.props.setQueryParams(
            pluralize(this.props.scope),
            {
                [name]: value,
                page: 1,
            }
        );
    }

    handleReset(event) {
        this.form.reset();
        this.props.resetQuery(pluralize(this.props.scope));
        this.props.fetchData(pluralize(this.props.scope), null, null, this.props.locale, null);
    }

    handleSubmit(event) {
        if (event !== undefined) event.preventDefault();
        this.props.fetchData(pluralize(this.props.scope), null, null, this.props.locale, parametrizedQuery(this.props.query));
    }

    searchFormElement(attribute) {
        return (
            <FormElement label={t(this.props, `activerecord.attributes.${this.props.scope}.${attribute}`)} >
                <input 
                    className="search-input" 
                    type="text" 
                    name={attribute}
                    value={this.props.query[attribute]}
                    onChange={this.handleChange}
                />
            </FormElement>
        )
    }

    render() {
        let _this = this;
        return (
            <div>
                <form 
                    ref={(form) => { this.form = form; }} 
                    id={`${this.props.scope}_search_form`} 
                    className={'flyout-search default'} 
                    onSubmit={this.handleSubmit}
                >
                    {this.props.searchableAttributes.map((attribute, index) => {
                        return this.searchFormElement(attribute);
                    })}
                    <input 
                        className="lonely-search-button" 
                        value={t(this.props, this.props.submitText || 'search')}
                        type="submit" 
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
