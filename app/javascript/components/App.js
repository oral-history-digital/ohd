import React from 'react';
import request from 'superagent';
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
    this.archiveSearch('/de/suchen', {});
  }

  handleArchiveSearchResults(results) {
    this.setState({
      segments: results.segments,
      facets: results.facets,
      interviews: results.interviews,
      sessionQuery: results.session_query,
      fulltext: results.fulltext
    })
  }

  archiveSearch(url, queryParams) {
    console.log(queryParams);
    request
      .get(url)
      .set('Accept', 'application/json')
      .query(queryParams)
      .end((error, res) => {
        if (res) {
          if (res.error) {
            console.log("loading segments failed: " + error);
          } else {
            let json = JSON.parse(res.text);
            console.log(json);
            this.handleArchiveSearchResults(json);
          }
        }
      });
  }

  tabIndex() {
    return this.props.flyoutTabIndex;
  }

  setInterviews(interviews) {
    this.setState({
      interviews: interviews
    })
  }

  getInterviews() {
    return this.state.interviews;
  }

  render () {
    return ( 
      <BrowserRouter history={hashHistory}>
        <div>
        <Route path="/:lang/interviews/:archiveId" component={props => (
                                                  <Interview 
                                                    appState={this.state}
                                                    archiveSearch={this.archiveSearch.bind(this)} 
                                                    tabIndex={this.tabIndex()}
                                                    {...props}
                                                  />
                                               ) }/>
        <Route path="/:lang/suchen" component={ props => (
                                                  <Interviews 
                                                    appState={this.state}
                                                    archiveSearch={this.archiveSearch.bind(this)} 
                                                    tabIndex={this.tabIndex()}
                                                    {...props}
                                                  />
                                               ) }/>
        <Route path="/:lang/searches" component={ props => (
                                                  <Interviews 
                                                    appState={this.state}
                                                    archiveSearch={this.archiveSearch.bind(this)} 
                                                    tabIndex={this.tabIndex()}
                                                    {...props}
                                                  />
                                               ) }/>
        </div>
      </BrowserRouter>
    );
  }
}

