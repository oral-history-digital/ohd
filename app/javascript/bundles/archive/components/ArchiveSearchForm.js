import React from 'react';
import { Navigation } from 'react-router-dom'
import FacetContainer from '../containers/FacetContainer';
import UserContentFormContainer from '../containers/UserContentFormContainer';

import {ARCHIVE_SEARCH_URL} from '../constants/archiveConstants';


export default class ArchiveSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fulltext: props.fulltext,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        if (!this.facetsLoaded()) {
            //this.props.loadFacets();
            this.props.searchInArchive({});
        }
    }

    facetsLoaded() {
        return this.props.facets;
        //return this.props.facets && this.props.facets.unqueried_facets;
    }

    handleChange(event) {
        const value =  event.target.value;
        const name =  event.target.name;

        this.props.setQueryParams(name, value);
        //this.setState({[name]: value});
    }

    handleReset(event){
        //this.props.resetQuery();
        $('input[type=checkbox]').attr('checked',false);
        this.setState({['fulltext']: ''}, function (){
            this.props.searchInArchive({});
        });
    }


    handleSubmit(event) {
        if (event !== undefined) event.preventDefault();
        //this.props.searchInArchive(this.props.query);
        let query = ($('#archiveSearchForm').serialize());
        if (query == "fulltext=") {
            this.props.searchInArchive({});
        } else{
            this.props.searchInArchive(query);
        }
        this.context.router.history.push(ARCHIVE_SEARCH_URL);
    }

    saveSearchForm() {
        return  <UserContentFormContainer 
                    title=''
                    description=''
                    properties={Object.assign({}, this.props.query, {fulltext: this.props.query.fulltext})}
                    type='Search'
                />
    }

    saveSearchButton() {
         return <button 
                    onClick={() => this.props.openArchivePopup({
                        title: 'Save search', 
                        content: this.saveSearchForm()
                    })}
                >
                    {'Save search'}
                </button>
    }

    render() {
        return (
            <div>
                <form id="archiveSearchForm" className={'flyout-search'} onSubmit={this.handleSubmit}>

                    <input className={'search-input'} type="text" name="fulltext" value={this.state.fulltext} placeholder="Eingabe ..." onChange={this.handleChange}/>
                    <input className="search-button" id="search-button" title="Suche im Archiv ..." type="submit" value=""/>
                    {this.renderFacets()}
                </form>

                <button className={'reset'} onClick={this.handleReset}>Reset</button>
                {this.saveSearchButton()}
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
