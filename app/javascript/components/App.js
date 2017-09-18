import React from 'react';
import Loader from '../lib/loader'
import { BrowserRouter, Route, hashHistory } from 'react-router-dom'

import Interview from '../components/Interview';
import Interviews from '../components/Interviews';

export default class App extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      lang: 'de',
      interview: null, 
      segments: [],
      headings: [],
      facets: {},
      interviews: [],
      searchQuery:{},
      fulltext:""
    };
  }

  componentDidMount() {
    Loader.getJson('/de/suchen', {}, this.setState.bind(this));
  }

  archiveSearch(url, queryParams) {
    Loader.getJson('/de/suchen', queryParams, this.setState.bind(this));
  }

  render () {
    return ( 
      <BrowserRouter history={hashHistory}>
        <div>
        <Route path="/:lang/interviews/:archiveId" component={props => (
                                                  <Interview 
                                                    appState={this.state}
                                                    setAppState={this.setState.bind(this)}
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

