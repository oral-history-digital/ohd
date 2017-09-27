import React from 'react';

export default class Facet extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChange = this.onChange.bind(this);

        let categoryId = this.props.data[0].id;
        let openState = false;
        let checkedFacets = this.props.sessionQuery[categoryId];

        if (checkedFacets !== undefined) {
            openState = checkedFacets. length > 0;
        }

        this.state = {
            open: openState,
            class: openState ? "flyout-sub-tab open": "flyout-sub-tab"
        };
    }

    handleClick() {
        if (this.state.open) {
            this.setState({['open']: false});
            this.setState({['class']: "flyout-sub-tab"});
        } else {
            this.setState({['open']: true});
            this.setState({['class']: "flyout-sub-tab open"});
        }
    }

    render() {
        return (
            <div className={this.state.class}>
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

    onChange(event) {
        this.props.handleSubmit();
    }


    renderSubfacets() {
        let subfacets = this.props.data[1];
        let categoryId = this.props.data[0].id;

        return subfacets.map((subfacet, index) => {
            let checkedState = false;
            let checkedFacets = this.props.sessionQuery[categoryId];
            if (checkedFacets !== undefined) {
                checkedState = checkedFacets.indexOf(subfacet.entry.id.toString()) > -1;
            }

            return (
                <div key={"subfacet-" + index}>
                    <label><input className={categoryId + ' checkbox'} id={categoryId + "_" + subfacet.entry.id}
                           name={categoryId + "[]"} checked={checkedState} type="checkbox" value={subfacet.entry.id}
                           onChange={this.onChange}>
                    </input>
                    
                        <span> {subfacet.entry.descriptor}</span>
                        <span>({subfacet.count})</span>
                    </label>
                </div>
            )
        })
    }
}
