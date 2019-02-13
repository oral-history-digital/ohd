import React from 'react';
import PropTypes from 'prop-types';
import spinnerSrc from '../../../images/large_spinner.gif'
import FormElement from './form/Element'
import { t, pluralize, parametrizedQuery, statifiedQuery } from '../../../lib/utils';


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
            !this.props.dataStatus[statifiedQuery(this.props.query)]
         ) {
            this.props.fetchData(pluralize(this.props.scope), null, null, this.props.locale, parametrizedQuery(this.props.query));
         }
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

    optionsForSelect(attributeName, opts) {
        return opts.map((value, index) => {
            return (
                <option value={value} key={`${attributeName}-option-${index}`}>
                    {t(this.props, `${pluralize(attributeName)}.${value}`)}
                </option>
            )
        })
    }

    searchFormElement(element) {
        let opts = {
            className: "search-input full" ,
            name: element.attributeName,
            value: this.props.query[element.attributeName],
            onChange: this.handleChange,
        };

        if (element.type === 'select') {
            return React.createElement('select', opts, this.optionsForSelect(element.attributeName, element.values));
        } else {
            opts.type = "text";
            return React.createElement('input', opts);
        }
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
                    {this.props.searchableAttributes.map((element, index) => {
                        return (
                            <FormElement label={t(this.props, `activerecord.attributes.${this.props.scope}.${element.attributeName}`)} >
                                {this.searchFormElement(element)}
                            </FormElement>
                        )
                    })}
                    <input 
                        className="lonely-search-button" 
                        value={t(this.props, this.props.submitText || 'search')}
                        type="submit" 
                    />
                </form>
            </div>
        );
    }

    static contextTypes = {
        router: PropTypes.object
    }
}
