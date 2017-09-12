import React from 'react';
import Subfacet from '../components/Subfacet';

import '../css/facets';

export default class Facet extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.isChecked = this.isChecked.bind(this);

        let categoryId = this.props.data[0].id;

        this.state = {
            open: false,
            class: "facet"
        };

        let initArray = (this.props.session_query !== undefined && (this.props.session_query[categoryId] !== undefined)) ? this.props.session_query[categoryId] : [];
        this.state[categoryId + "[]"] = initArray;

        console.log(categoryId);
        console.log(initArray);

    }


    handleClick() {
        if (this.state.open) {
            this.setState({['open']: false});
            this.setState({['class']: "facet"});
        } else {
            this.setState({['open']: true});
            this.setState({['class']: "facet open"});
        }
    }

    render() {
        return (
            <div className={this.state.class}>
                <button>toggle</button>
                <div className="facet-name" onClick={this.handleClick}>
                    {this.props.data[0].name}
                </div>
                <div className="subfacets">
                    <div className="subfacet">
                        {this.renderSubfacets()}
                    </div>
                </div>
            </div>
        )
    }

    onChange(event, name, newState, value) {
        var newArray = this.state[name].slice();
        if (newState) {
            newArray.push(value);
        } else {
            var index = newArray.indexOf(value);
            newArray.splice(index, 1);
        }
        this.setState({[name]: newArray}, function(){
            this.props.handleChange(null, name, newArray);
        });

    }

    isChecked(name, value){
        let checked = this.state[name].indexOf(value) > -1;
        return checked;
    }


    renderSubfacets() {
        let subfacets = this.props.data[1];
        let categoryId = this.props.data[0].id;

        return subfacets.map((subfacet, index) => {
            return (
                <Subfacet
                    categoryId={categoryId}
                    data={subfacet}
                    key={"subfacet-" + index}
                    onChange={this.onChange}
                    isChecked={this.isChecked}
                />
            )
        })
    }
}





