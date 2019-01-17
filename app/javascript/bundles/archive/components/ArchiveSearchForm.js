import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import {Navigation} from 'react-router-dom'
import FacetContainer from '../containers/FacetContainer';
import spinnerSrc from '../../../images/large_spinner.gif'
import { t } from '../../../lib/utils';


export default class ArchiveSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        if (!this.facetsLoaded()) {
            let url = `/${this.context.router.route.match.params.locale}/searches/archive`;
            this.props.searchInArchive(url, {});
        }
    }

    facetsLoaded() {
        return this.props.facets;
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.props.setQueryParams('archive', {[name]: value});
    }

    handleReset(event) {
        this.form.reset();
        this.props.resetQuery('archive');
        let url = `/${this.context.router.route.match.params.locale}/searches/archive`;
        this.props.searchInArchive(url, {});
    }

    handleSubmit(event) {
        if (event !== undefined) event.preventDefault();
        let params = serialize(this.form, {hash: true});
        params = this.getValueFromDataList(params, event);
        params = this.prepareQuery(params);
        params['page'] = 1;
        this.submit(params);
    }

    getValueFromDataList(params, event) {
        if (event && event.currentTarget.list) {
            for (let i = 0; i < event.currentTarget.list.children.length; i++) {
                if (event.currentTarget.list.children[i].innerText === event.currentTarget.value) {
                    let facet = event.currentTarget.name;
                    let facetValue = event.currentTarget.list.children[i].dataset[facet];
                    params[facet] = [facetValue];
                }
            }
        }
        return params;
    }

    arrayToRange(min, max) {
        let array = [];
        if (min <= max) {
            for (let i = min; i <= max; i++){
                array.push(i)
            }
        }
        return array;
    }
    
    prepareQuery(params) {
        // Set params[key] to empty array. Otherwise Object.assign in reducer would not reset it.
        // Thus the last checkbox would never uncheck.
        // Send list values. e.g. key[] = ["a", "b"]
        let preparedQuery = {};
        if (params['fulltext']) preparedQuery['fulltext'] = params['fulltext'];
        for (let [key, value] of Object.entries(this.props.facets)) {
            preparedQuery[`${key}[]`] = params[key] && !(typeof params[key] == "string") ? params[key] : []
        }
        // create list of years for year_of_birth
        if (params['year_of_birth_min']) {
            preparedQuery['year_of_birth[]'] = this.arrayToRange( params['year_of_birth_min'], params['year_of_birth_max'] ) 
        }
        return preparedQuery;
    }

    submit(params) {
        if (!this.props.isArchiveSearching) {
            let url = `/${this.context.router.route.match.params.locale}/searches/archive`;
            this.props.searchInArchive(url, params);
            this.context.router.history.push(url);
        }
    }

    renderResetButton() {
        if(Object.keys(this.props.query).length > 0 && this.props.query['page']) {
            return (
                <button 
                    className={'reset'}
                    onClick={this.handleReset}>{t(this.props, 'reset')}
                </button>
            )
        } else {
            return null;
        }
    }

    searchform(){
        if (!this.facetsLoaded()) {
            return <div className="facets-spinner"> <img src={spinnerSrc} /></div>;
        } else {
            let fulltext = this.props.query.fulltext ? this.props.query.fulltext : "";
            return(
                <div>
                    <form 
                        ref={(form) => { this.form = form; }} 
                        id="archiveSearchForm" 
                        className={'flyout-search'} 
                        onSubmit={this.handleSubmit}
                    >
                        <input 
                            className="search-input" 
                            type="text" 
                            name="fulltext" 
                            value={fulltext}
                            placeholder={t(this.props, (this.props.project === 'hagen' ? 'enter_field_hagen' : 'enter_field'))}
                            onChange={this.handleChange}
                            list='allInterviewTitles' 
                            autoFocus
                        />
                        {this.renderDataList()}
                        <input 
                            className="search-button" 
                            id="search-button"
                            title={t(this.props, 'archive_search')} 
                            type="submit" 
                            value=""
                        />
                        {this.renderResetButton()}
                        {this.renderFacets()}
                    </form>
                </div>

            )
        }
    }

    render() {
        return this.searchform();
    }

    yearRange(facet) {
        if (facet === 'year_of_birth') {
            return [
                parseInt(Object.keys(this.props.facets[facet]['subfacets']).sort(function(a, b){return a-b})[0]),
                parseInt(Object.keys(this.props.facets[facet]['subfacets']).sort(function(a, b){return b-a})[0])
            ]
        }
        else {
            return []
        }
    }

    currentYearRange(){
        return [
            this.props.query['year_of_birth[]'] && parseInt(this.props.query['year_of_birth[]'][0]),
            this.props.query['year_of_birth[]'] && parseInt(this.props.query['year_of_birth[]'][this.props.query['year_of_birth[]'].length -1])
        ]
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
                        slider={facet === 'year_of_birth'}
                        sliderMin={this.yearRange(facet)[0]}
                        sliderMax={this.yearRange(facet)[1]}
                        currentMin={this.currentYearRange()[0] || this.yearRange(facet)[0]}
                        currentMax={this.currentYearRange()[1] || this.yearRange(facet)[1]}
                    />
                )
            })
        }
    }

    renderDataList() {
        return (
            <datalist id="allInterviewTitles">
                <select>
                    {this.renderOptions()}
                </select>
            </datalist>
        );
    }

    renderOptions() { 
        return (this.props.allInterviewsTitles.concat(this.props.allInterviewsPseudonyms)).map((title, index) => {
                return (
                    <option key={"option-" + index} value={`"${title[this.props.locale]}"`} />
                )
            }
        )
    }

    static contextTypes = {
        router: PropTypes.object
    }
}
