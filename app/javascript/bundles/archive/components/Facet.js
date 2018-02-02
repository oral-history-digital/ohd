import React from 'react';
import ArchiveUtils from "../../../lib/utils";

export default class Facet extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChange = this.onChange.bind(this);

        let openState = false;
        if (this.checkedFacets()) {
            openState = this.checkedFacets().length > 0;
        }

        this.state = {
            open: openState,
            class: openState ? "accordion active" : "accordion",
            panelClass: openState ? "panel open" : "panel"
        };
    }

    checkedFacets() {
        return this.props.query[this.props.facet];
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

    panelContent() {
        if (this.props.inputField && Object.values(this.props.data.subfacets).filter(i => i.count > 0).length > 9) {
            return (
                <div className={this.state.panelClass}>
                    <input className='input-list-search'
                           list="inputList"
                           placeholder={ArchiveUtils.translate(this.props, 'enter_field')}
                           name={this.props.facet}
                           onChange={this.props.handleInputList}/>
                    <datalist id="inputList">
                        {this.renderOptions()}
                    </datalist>
                </div>
            )
        } else {
            return (
                <div className={this.state.panelClass}>
                    <div className="flyout-radio-container">
                        {this.renderSubfacets()}
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="subfacet-container">
                <button className={this.state.class} onClick={this.handleClick}>
                    {this.props.data.descriptor[this.props.locale]}
                </button>
                {this.panelContent()}
            </div>
        )
    }


    onChange(event) {
        this.props.handleSubmit();
    }

    renderOptions() {
        return Object.keys(this.props.data.subfacets).map((subfacetId, index) => {
                let subfacet = this.props.data.subfacets[subfacetId];
                const dataProps = {[`data-${this.props.facet}`]: `${subfacetId}`};
                return (
                    <option key={"subfacet-" + index} {...dataProps}>
                        {subfacet.descriptor[this.props.locale]}
                    </option>
                )
            }
        )
    }

    renderSubfacets() {
        return Object.keys(this.props.data.subfacets).map((subfacetId, index) => {
            let subfacet = this.props.data.subfacets[subfacetId]
            if (subfacet.count) {
                let checkedState = false;
                if (this.checkedFacets()) {
                    checkedState = this.checkedFacets().indexOf(subfacetId.toString()) > -1;
                }
                return (
                    <div key={"subfacet-" + index}>
                        <input className={'with-font ' + this.props.facet + ' checkbox'}
                               id={this.props.facet + "_" + subfacetId}
                               name={this.props.facet + "[]"} checked={checkedState} type="checkbox"
                               value={subfacetId}
                               onChange={this.onChange}>
                        </input>
                        <label htmlFor={this.props.facet + "_" + subfacetId}>
                            {subfacet.descriptor[this.props.locale]}
                            <span className='flyout-radio-container-facet-count'>({subfacet.count})</span>
                        </label>
                    </div>
                )
            }
        })
    }
}
