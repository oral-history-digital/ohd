import React from 'react';
import request from 'superagent';
import Facet from '../components/Facet';


export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.interviewId,
            fulltext: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (target.type === 'checkbox' ){
            var newArray = this.state[name] == undefined ? [] : this.state[name].slice();
            if (target.checked) {
                newArray.push(value);
            } else {
                var index = newArray.indexOf(value);
                newArray.splice(index, 1);
            }
            this.setState({[name]: newArray}, this.performSearch);
        } else {
            this.setState({[name]: value});
        }
    }

    performSearch(){
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
            .query(this.state)
            .end((error, res) => {
                if (res) {
                    if (res.error) {
                        console.log("loading segments failed: " + error);
                    } else {
                        let json = JSON.parse(res.text);
                        this.props.handleResults(json);
                    }
                }
            });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" name="fulltext" value={this.state.fulltext} onChange={this.handleChange}/>
                    </label>
                    { this.renderFacets() }

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
                        data={facet}
                        key={"facet-" + index}
                        handleChange={this.handleChange}
                    />
                )
            })
        }
    }
}
