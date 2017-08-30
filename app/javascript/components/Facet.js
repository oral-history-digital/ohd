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
                        {this.renderSubfacets(this.props.data[1])}
                    </div>
                </div>
            </div>
        )
    }


    renderSubfacets(subfacets) {
        return subfacets.map((subfacet, index) => {
            return (
                <div key={"subfacet-" + index}>
                    {subfacet.descriptor}
                </div>
            )
        })
    }
}


