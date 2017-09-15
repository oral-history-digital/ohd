import React from 'react';
import Loader from '../lib/loader'
//import request from 'superagent';
import { BrowserRouter, Route, hashHistory } from 'react-router-dom'

import Interview from '../components/Interview';
import Interviews from '../components/Interviews';

export default class App extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      segments: [],
      facets: {},
      interviews: [],
      searchQuery:{},
      fulltext:""
    };
  }

  componentDidMount() {
    //this.archiveSearch('/de/suchen', {});
    Loader.getJson('/de/suchen', {}, this.setState.bind(this));
  }

  //handleArchiveSearchResults(results) {
    //this.setState({
      //segments: results.segments,
      //facets: results.facets,
      //interviews: results.interviews,
      //sessionQuery: results.session_query,
      //fulltext: results.fulltext
    //})
  //}

  archiveSearch(url, queryParams) {
    Loader.getJson('/de/suchen', queryParams, this.setState.bind(this));
  }
    //console.log(queryParams);
    //request
      //.get(url)
      //.set('Accept', 'application/json')
      //.query(queryParams)
      //.end((error, res) => {
        //if (res) {
          //if (res.error) {
            //console.log("loading segments failed: " + error);
          //} else {
            //let json = JSON.parse(res.text);
            //console.log(json);
            //this.handleArchiveSearchResults(json);
          //}
        //}
      //});
  //}

  render () {
    return ( 
      <BrowserRouter history={hashHistory}>
        <div>
        <Route path="/:lang/interviews/:archiveId" component={props => (
                                                  <Interview 
                                                    appState={this.state}
                                                    archiveSearch={this.archiveSearch.bind(this)} 
                                                    {...props}
                                                  />
                                               ) }/>
        <Route path="/:lang/suchen" component={ props => (
                                                  <Interviews 
                                                    appState={this.state}
                                                    archiveSearch={this.archiveSearch.bind(this)} 
                                                    {...props}
                                                  />
                                               ) }/>
        <Route path="/:lang/searches" component={ props => (
                                                  <Interviews 
                                                    appState={this.state}
                                                    archiveSearch={this.archiveSearch.bind(this)} 
                                                    {...props}
                                                  />
                                               ) }/>
        </div>
      </BrowserRouter>
    );
  }
}

