import React from 'react';
import request from 'superagent';
import ArchiveSearchForm from '../components/ArchiveSearchForm';


export default class ArchiveSearch extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            segments: [],
            facets: {},//props.facets,
            interviews: "",//props.interviews,
            searchQuery:{},
            fulltext:""
        };

        this.search('/suchen', {});
    }

    componentDidUpdate() {
        this.renderInterviews();
    }

    handleResults(results) {
        this.setState({
            segments: results.segments,
            facets: results.facets,
            interviews: results.interviews,
            sessionQuery: results.session_query,
            fulltext: results.fulltext
        })
    }

    search(url, queryParams) {
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
                        this.handleResults(json);
                    }
                }
            });
    }


    renderInterviews() {
        if (this.state.interviews) {
            if (this.state.interviews.length > 0) {
                $('.wrapper-content').replaceWith(this.state.interviews);
            }
        }
    }

    renderForm(){
        console.log(this.state.facets.query_facets);
        if (this.state.facets && this.state.facets.query_facets) {
            return (
                <div>
                    <ArchiveSearchForm
                        url={this.props.url}
                        handleResults={this.handleResults.bind(this)}
                        facets={this.state.facets}
                        sessionQuery={this.state.sessionQuery}
                        fulltext={this.state.fulltext}
                        search={this.search}
                    />
                </div>
            );
        }
    }


    render() {
        return (
            <div>
                { this.renderForm() }
            </div>
        )
    }
}
