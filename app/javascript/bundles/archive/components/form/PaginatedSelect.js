import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { AsyncPaginate } from "react-select-async-paginate";

import ElementContainer from '../../containers/form/ElementContainer';
import { fetchData } from '../actions/dataActionCreators';
import { t, pluralize, parametrizedQuery, statifiedQuery, camelcase } from 'lib/utils';

//import loadOptions from "./loadOptions";

export default PaginatedSelect = () => {
    return (
        let value = this.props.value || this.props.data && this.props.data[this.props.attribute] || '';
        return (
            <ElementContainer
                scope={this.props.scope}
                attribute={this.props.attribute}
                label={this.props.label}
                labelKey={this.props.labelKey}
                showErrors={this.props.showErrors}
                css={this.props.css}
                hidden={this.props.hidden}
                valid={this.state.valid}
                mandatory={typeof(this.props.validate) === 'function'}
                elementType='select'
                individualErrorMsg={this.props.individualErrorMsg}
                help={this.props.help}
            >
                <AsyncPaginate
                    value={value}
                    loadOptions={loadOptions}
                    onChange={this.handleChange}
                />
            </ElementContainer>
        );
    );
};

async function loadOptions(search, loadedOptions, { page }) {

    this.props.setQueryParams(pluralize(this.props.scope), {page: this.props.query.page + 1});
    this.props.fetchData(this.props, pluralize(this.props.scope), null, null, parametrizedQuery(this.props.query));

    !this.props.resultPagesCount || this.props.resultPagesCount > (this.props.query.page)

    const response = await fetch(`/awesome-api-url/?search=${search}&offset=${loadedOptions.length}`);
    const responseJSON = await response.json();

    return {
        options: responseJSON.results,
        hasMore: responseJSON.has_more,
        additional: {
            page: page + 1,
        },
    };
}

