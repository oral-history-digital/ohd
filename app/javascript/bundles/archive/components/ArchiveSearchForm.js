import React from 'react';
import { Navigation } from 'react-router-dom'
import Facet from '../components/Facet';
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
            this.props.resetSearchInArchive({});
        }
    }

    facetsLoaded() {
        return this.props.facets && this.props.facets.unqueried_facets;
    }

    handleChange(event) {
        const value =  event.target.value;
        const name =  event.target.name;

        this.setState({[name]: value});
    }

    handleReset(event){
        $('input[type=checkbox]').attr('checked',false);
        this.setState({['fulltext']: ''}, function (){
            this.props.resetSearchInArchive( {});
        });
    }


    handleSubmit(event) {
        if (event !== undefined) event.preventDefault();

        let query = ($('#archiveSearchForm').serialize());
        if (query == "fulltext=") {
            this.props.resetSearchInArchive({});
        } else{
            this.props.searchInArchive(query);
        }
        this.context.router.history.push(ARCHIVE_SEARCH_URL);
    }

    saveSearchForm() {
        return  <UserContentFormContainer 
                    title=''
                    description=''
                    properties={Object.assign({}, this.props.searchQuery, {fulltext: this.props.fulltext})}
                    type='Search'
                />
    }

    render() {
        return (
            <div>
                <form id="archiveSearchForm" onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" name="fulltext" value={this.state.fulltext} onChange={this.handleChange}/>
                    </label>
                    {this.renderFacets()}
                    <input type="submit" value="Submit"/>
                </form>
                <button onClick={this.handleReset}>Reset</button>
                <button 
                    onClick={() => this.props.openArchivePopup({
                        title: 'Save search', 
                        content: this.saveSearchForm()
                    })}
                >
                    {'Save search'}
                </button>
            </div>
        );
    }


    renderFacets() {
        if (this.facetsLoaded()) {
            return this.props.facets.unqueried_facets.map((facet, index) => {
                //facet.locale = this.props.locale;
                return (
                    <Facet
                        data={facet}
                        sessionQuery={this.props.searchQuery}
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
