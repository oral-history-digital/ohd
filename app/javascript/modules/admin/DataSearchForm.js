import { createElement, Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { FormElement } from 'modules/forms';
import { HelpText } from 'modules/help-text';
import { isMobile } from 'modules/user-agent';
import { pluralize } from 'modules/strings';
import { t } from 'modules/i18n';
import parametrizedQuery from './parametrizedQuery';

export default class DataSearchForm extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentWillUnmount() {
        this.handleReset();
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

    handleReset() {
        this.form.reset();
        this.props.resetQuery(pluralize(this.props.scope));
        this.props.fetchData(this.props, pluralize(this.props.scope), null, null, null);
    }

    handleSubmit(event) {
        if (event !== undefined) event.preventDefault();
        if (isMobile()) {
            this.props.hideSidebar();
        }
        this.props.fetchData(this.props, pluralize(this.props.scope), null, null, parametrizedQuery(this.props.query));
    }

    optionsForSelect(attributeName, values) {
        let opts = values.map((value, index) => {
            return (
                <option value={value} key={`${attributeName}-option-${index}`}>
                    {t(this.props, `${pluralize(attributeName)}.${value}`)}
                </option>
            )
        })
        opts.unshift(
            <option value='' key={`${this.props.scope}-choose`}>
                {t(this.props, 'choose')}
            </option>
        )
        return opts;
    }

    searchFormElement(element) {
        let opts = {
            className: classNames('Input', 'Input--fullWidth'),
            name: element.attributeName,
            value: this.props.query[element.attributeName] || element.value,
            onChange: this.handleChange,
            key: `search-form-element-${element.attribute}`
        };

        if (element.type === 'select') {
            return createElement('select', opts, this.optionsForSelect(element.attributeName, element.values));
        } else {
            opts.type = "text";
            return createElement('input', opts);
        }
    }

    render() {
        const { helpTextCode, scope, searchableAttributes, submitText } = this.props;

        return (
            <form
                ref={(form) => { this.form = form; }}
                id={`${scope}_search_form`}
                className="flyout-search default"
                onSubmit={this.handleSubmit}
            >
                {helpTextCode && <HelpText code={helpTextCode} />}

                {searchableAttributes.map((element) => {
                    return (
                        <FormElement label={t(this.props, `activerecord.attributes.${scope}.${element.attributeName}`)} key={`form-element-${element.attributeName}`}>
                            {this.searchFormElement(element)}
                        </FormElement>
                    )
                })}
                <input
                    className="lonely-search-button"
                    value={t(this.props, submitText || 'search')}
                    type="submit"
                />
            </form>
        );
    }
}

DataSearchForm.propTypes = {
    helpTextCode: PropTypes.string,
};
