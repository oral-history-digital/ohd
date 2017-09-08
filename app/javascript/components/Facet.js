import React from 'react';
import Subfacet from '../components/Subfacet';

import '../css/facets';

export default class Facet extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChange = this.onChange.bind(this);

        let categoryId = this.props.data[0].id;

        this.state = {
            open: false,
            class: "facet"
        };
        this.state[categoryId + "[]"] = [];

    }

    isChecked(name, value) {
        let checked = this.props.state && this.props.state[name] != undefined && this.props.state[name].indexOf(value) > -1;
        return checked;
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


    renderSubfacets() {
        let subfacets = this.props.data[1];
        let categoryId = this.props.data[0].id;

        return subfacets.map((subfacet, index) => {

            let checkedState = this.state[categoryId+"[]"].indexOf(subfacet.entry.id) > -1;
            return (
                <Subfacet
                    checkedState={checkedState}
                    categoryId={categoryId}
                    data={subfacet}
                    key={"subfacet-" + index}
                    onChange={this.onChange}

                />
            )
        })
    }
}





