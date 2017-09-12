import React from 'react';
import request from 'superagent';
import Facet from '../components/Facet';


export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.interviewId,
            fulltext: (this.props.facets !== undefined && this.props.facets.session_query !== undefined) ? this.props.facets.session_query.fulltext : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event, arrayName, array) {
        const facetClicked = event === null;
        const value = facetClicked ? array : event.target.value;
        const name = facetClicked ? arrayName : event.target.name;

        if (Array.isArray(value) && value.length == 0){
            let oldState = this.state;
            delete oldState[name];
            this.setState(oldState, this.performSearch);
        } else {
            this.setState({[name]: value}, function () {
                if (facetClicked) {
                    this.performSearch();
                }
            });
        }
    }

    performSearch() {
        this.search();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.search();
    }

    search() {

        let url = this.props.url;

        request
            .get(url)
            .set('Accept', 'application/json')
            .query($("#searchForm").serialize())
            .end((error, res) => {
                if (res) {
                    if (res.error) {
                        console.log("loading segments failed: " + error);
                    } else {
                        let json = JSON.parse(res.text);
                        console.log(json);

                        this.setState({['fulltext']: json.facets.session_query.fulltext});

                        this.props.handleResults(json);
                    }
                }
            });
    }

    render() {
        return (
            <div>
                <form id="searchForm" onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" name="fulltext" value={this.state.fulltext} onChange={this.handleChange}/>
                    </label>
                    {this.renderFacets()}

                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }


    renderFacets() {
        if (this.props.facets && this.props.facets.query_facets) {
            return this.props.facets.unqueried_facets.map((facet, index) => {
                //facet.lang = this.props.lang;
                return (
                    <Facet
                        session_query={this.props.facets.session_query}
                        data={facet}
                        key={"facet-" + index}
                        handleChange={this.handleChange}
                    />
                )
            })
        }
    }
}
