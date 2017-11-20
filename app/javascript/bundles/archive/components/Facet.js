import React from 'react';

export default class Facet extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChange = this.onChange.bind(this);

        let categoryId = this.props.facet;
        let openState = false;
        let checkedFacets = this.props.query[categoryId];

        if (checkedFacets !== undefined) {
            openState = checkedFacets.length > 0;
        }

        this.state = {
            open: openState,
            class: openState ? "accordion active" : "accordion",
            panelClass: openState ? "panel open" : "panel"
        };
    }

    handleClick(event) {
        if (event !== undefined) event.preventDefault();
        if (this.state.open) {
            this.setState({['open']: false});
            this.setState({['class']: "accordion"});
            this.setState({['panelClass']: "panel"});
        } else {
            this.setState({['open']: true});
            this.setState({['class']: "accordion active"});
            this.setState({['panelClass']: "panel open"});
        }
    }

    render() {
        return (
            <div className="subfacet-container">
                <button className={this.state.class} onClick={this.handleClick}>
                    {this.props.data.descriptor[this.props.locale]}
                </button>
                <div className={this.state.panelClass}>
                    <div className="flyout-radio-container">
                        {this.renderSubfacets()}
                    </div>
                </div>
            </div>
        )
    }

    onChange(event) {
        console.log('handleSubmit');
        this.props.handleSubmit();
    }


    renderSubfacets() {
        let categoryId = this.props.facet;
        //let categoryId = this.props.data[0].id;
        let checkedFacets = this.props.query[categoryId];

        return Object.keys(this.props.data.subfacets).map((subfacetId, index) => {
            let subfacet = this.props.data.subfacets[subfacetId]
            let checkedState = false;
            if (checkedFacets !== undefined) {
                checkedState = checkedFacets.indexOf(subfacetId.toString()) > -1;
            }

            return (
                <div key={"subfacet-" + index}>
                    <input className={'with-font ' + categoryId + ' checkbox'} id={categoryId + "_" + subfacetId}
                           name={categoryId + "[]"} checked={checkedState} type="radio" value={subfacetId}
                           onChange={this.onChange}>
                    </input>
                    <label htmlFor={categoryId + "_" + subfacetId}>
                        {subfacet.descriptor[this.props.locale]}
                        <span>({subfacet.count})</span>
                    </label>
                </div>
            )
        })
    }
}
