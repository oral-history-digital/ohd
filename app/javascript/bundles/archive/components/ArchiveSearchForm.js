import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import {Navigation} from 'react-router-dom'
import FacetContainer from '../containers/FacetContainer';
import spinnerSrc from '../../../images/large_spinner.gif'
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
            let url = `/${this.props.locale}/searches/archive`;
            this.props.searchInArchive(url, {});
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
        let url = `/${this.props.locale}/searches/archive`;
        this.props.searchInArchive(url, {});
    }

    handleInputList(event) {
        for (let i = 0; i < event.currentTarget.list.children.length; i++) {
            if (event.currentTarget.list.children[i].innerText === event.currentTarget.value) {
                let facet = event.currentTarget.name;
                let facetValue = event.currentTarget.list.children[i].dataset[facet];
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

    submit(params) {
        if (!this.props.isArchiveSearching) {
            // Set params[key] to empty array. Otherwise Object.assign in reducer would not reset it.
            // Thus the last checkbox would never uncheck.
            let preparedQuery = {};
            if (params['fulltext']) preparedQuery['fulltext'] = params['fulltext'];
            for (let [key, value] of Object.entries(this.props.facets)) {
                preparedQuery[`${key}[]`] = params[key] && !(typeof params[key] == "string") ? params[key] : []
            }
            if (params) {
                let url = `/${this.props.locale}/searches/archive`;
                this.props.searchInArchive(url, preparedQuery);
                this.context.router.history.push(url);
            }
        }
    }

    searchform(){
        if (!this.facetsLoaded()) {
            return <div className="facets-spinner"> <img src={spinnerSrc} /></div>;
        } else {
            let fulltext = this.props.query.fulltext ? this.props.query.fulltext : "";
            return(
                <div>
                    <form ref={(form) => {
                        this.form = form;
                    }} id="archiveSearchForm" className={'flyout-search'} onSubmit={this.handleSubmit}>
                        <input className="search-input" type="text" name="fulltext" value={fulltext}
                               placeholder={ArchiveUtils.translate(this.props, 'enter_field')}
                               onChange={this.handleChange} list='inputList'/>
                        {this.renderDataList()}
                        <input className="search-button" id="search-button"
                               title={ArchiveUtils.translate(this.props, 'archive_search')} type="submit" value=""/>
                        {this.renderFacets()}
                    </form>

                    <button className={'reset'}
                            onClick={this.handleReset}>{ArchiveUtils.translate(this.props, 'reset')}</button>
                </div>

            )
        }
    }

    render() {
        return this.searchform();
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

    renderDataList() {
        return (
        <datalist id="inputList">
            {this.renderOptions()}
        </datalist>
        );
    }

    renderOptions() {
        return this.props.allInterviewsTitles.map((title, index) => {

                return (
                    <option key={"option-" + index}>
                        {title[this.props.locale]}
                    </option>
                )
            }
        )
    }

    static contextTypes = {
        router: PropTypes.object
    }
}
