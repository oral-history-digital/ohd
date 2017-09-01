import React from 'react';
import '../css/facets';

export default class Facet extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            open: false,
            class: "facet"
        };
    }

    isChecked(name, value) {
        return  this.props.state && this.props.state[name] != undefined && this.props.state[name].indexOf(value) > -1
    }

    handleClick() {
        if (this.state.open) {
            this.setState({
                open: false,
                class: "facet"
            });
        } else {
            this.setState({
                open: true,
                class: "facet open"
            });
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
                        {this.renderSubfacets(this.props.data)}
                    </div>
                </div>
            </div>
        )
    }


    renderSubfacets(facets) {
        let subfacets = facets[1];
        let categoryId = facets[0].id;
        return subfacets.map((subfacet, index) => {
            return (
                <div key={"subfacet-" + index}>
                    <input className={categoryId + ' checkbox'} id={categoryId + "_" + subfacet.entry.id}
                           name={categoryId + "[]"} checked={this.isChecked(categoryId + "[]", subfacet.entry.id)} type="checkbox" value={subfacet.entry.id}
                           onChange={this.props.handleChange}>

                    </input>
                    <span> {subfacet.entry.descriptor}</span>

                    <span>({subfacet.count})</span>
                </div>
            )
        })
    }
}


