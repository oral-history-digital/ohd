import React from 'react';
import PropTypes from 'prop-types';
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
        this.handleInputList = this.handleInputList.bind(this);
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

    handleInputList(event){
        for( let i = 0; i < event.currentTarget.list.children.length; i++){
            if (event.currentTarget.list.children[i].innerText === event.currentTarget.value){
                let facet = event.currentTarget.name;
                let facetValue = event.currentTarget.list.children[0].dataset[facet];
                let params = serialize(this.form, {hash: true});
                for (let [key, value] of Object.entries(this.props.facets)) {
                    if (key == facet) {
                        params[key] = [facetValue];
                    }
                }
                this.submit(params);
                break;
            }
        }
    }

    handleSubmit(event) {
        if (event !== undefined) event.preventDefault();
        let params = serialize(this.form, {hash: true});
        this.submit(params);
    }

    submit(params){
        // Set params[key] to empty array. Otherwise Object.assign in reducer would not reset it.
        // Thus the last checkbox would never uncheck.
        for (let [key, value] of Object.entries(this.props.facets)) {
            params[key] = params[key] && !(typeof params[key] == "string")? params[key] : []
        }
        this.props.searchInArchive(params);
        this.context.router.history.push(ARCHIVE_SEARCH_URL);
    }

    render() {
        return (
            <div>
                <form ref={(form) => {
                    this.form = form;
                }} id="archiveSearchForm" className={'flyout-search'} onSubmit={this.handleSubmit}>
                    <input className={'search-input'} type="text" name="fulltext" value={this.props.query.fulltext}
                           placeholder={ArchiveUtils.translate(this.props, 'enter_field')} onChange={this.handleChange}/>
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
                        inputField={facet === 'archive_id'}
                        facet={facet}
                        key={"facet-" + index}
                        handleSubmit={this.handleSubmit}
                        handleInputList={this.handleInputList}
                    />
                )
            })
        }
    }

    static contextTypes = {
        router: PropTypes.object
    }
}
