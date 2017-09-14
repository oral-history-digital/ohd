import React from 'react';
//import { Redirect, BrowserRouter, Route, hashHistory, Navigation } from 'react-router-dom'
import { Navigation } from 'react-router-dom'
import request from 'superagent';
import Facet from '../components/Facet';


export default class ArchiveSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fulltext: props.appState.fulltext,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleChange(event) {
        const value =  event.target.value;
        const name =  event.target.name;

        this.setState({[name]: value});
    }

    handleReset(event){
        $('input[type=checkbox]').attr('checked',false);
        this.setState({['fulltext']: ''}, function (){
            this.props.archiveSearch(this.props.url + "/neu", {});
        });
    }


    handleSubmit(event) {
        if (event !== undefined) event.preventDefault();
        this.props.archiveSearch(this.props.url, $('#interviewSearchForm').serialize());
        this.context.router.history.push('/de/suchen');
    }


    render() {
        return (
            <div>
                <form id="interviewSearchForm" onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" name="fulltext" value={this.state.fulltext} onChange={this.handleChange}/>
                    </label>
                    {this.renderFacets()}
                    <input type="submit" value="Submit"/>
                </form>
                <button onClick={this.handleReset}>Reset</button>
            </div>
        );
    }


    renderFacets() {
        if (this.props.appState.facets.unqueried_facets) {
            return this.props.appState.facets.unqueried_facets.map((facet, index) => {
                //facet.lang = this.props.lang;
                return (
                    <Facet
                        data={facet}
                        sessionQuery={this.props.appState.sessionQuery}
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
