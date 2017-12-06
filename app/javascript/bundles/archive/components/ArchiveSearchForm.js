import React from 'react';
import serialize from 'form-serialize';
import {Navigation} from 'react-router-dom'
import FacetContainer from '../containers/FacetContainer';
import UserContentFormContainer from '../containers/UserContentFormContainer';

import {ARCHIVE_SEARCH_URL} from '../constants/archiveConstants';
import ArchiveUtils from '../../../lib/utils';


export default class ArchiveSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        if (!this.facetsLoaded()) {
            this.props.searchInArchive({});
        }
    }

    facetsLoaded() {
        return this.props.facets;
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.props.setQueryParams({[name]: value});
    }

    handleReset(event) {
        this.form.reset();
        this.props.resetQuery({});
        this.props.searchInArchive({});
    }


    handleSubmit(event) {
        if (event !== undefined) event.preventDefault();
        let params = serialize(this.form, {hash: true});
        // Set params[key] to empty array. Otherwise Object.assign in reducer would not reset it.
        // Thus the last checkbox would never uncheck.
        for (let [key, value] of Object.entries(this.props.facets)) {
            params[key] = params[key] ? params[key] : []
        }
        this.props.setQueryParams(params);
        this.props.searchInArchive(serialize(this.form, {hash: false}));
        this.context.router.history.push(ARCHIVE_SEARCH_URL);
    }

    render() {
        return (
            <div>
                <form ref={(form) => {
                    this.form = form;
                }} id="archiveSearchForm" className={'flyout-search'} onSubmit={this.handleSubmit}>
                    <input className={'search-input'} type="text" name="fulltext" value={this.props.query.fulltext}
                           placeholder="Eingabe ..." onChange={this.handleChange}/>
                    <input className="search-button" id="search-button"
                           title={ArchiveUtils.translate(this.props, 'archive_search')} type="submit" value=""/>
                    {this.renderFacets()}
                </form>

                <button className={'reset'}
                        onClick={this.handleReset}>{ArchiveUtils.translate(this.props, 'reset')}</button>
            </div>
        );
    }


    renderFacets() {
        if (this.facetsLoaded()) {
            return Object.keys(this.props.facets).map((facet, index) => {
                return (
                    <FacetContainer
                        data={this.props.facets[facet]}
                        facet={facet}
                        key={"facet-" + index}
                        handleSubmit={this.handleSubmit}
                    />
                )
            })
        }
    }

    static contextTypes = {
        router: React.PropTypes.object
    }
}
