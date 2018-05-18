import React from 'react';
import ArchiveUtils from "../../../lib/utils";

export default class Facet extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleInputForInputList = this.handleInputForInputList.bind(this);
        let openState = false;
        if (this.checkedFacets()) {
            openState = this.checkedFacets().length > 0;
        }

        this.state = {
            inputValue: "",
            open: openState,
            class: openState ? "accordion active" : "accordion",
            panelClass: openState ? "panel open" : "panel"
        };
    }

    checkedFacets() {
        return this.props.query[`${this.props.facet}[]`];
    }

    handleClick(event) {
        if (event !== undefined) event.preventDefault();
        if (this.state.open) {
            this.setState({
                ['open']: false,
                ['class']: "accordion",
                ['panelClass']: "panel"
            });
        } else {
            this.setState({
                ['open']: true,
                ['class']: "accordion active",
                ['panelClass']: "panel open"
            });
        }
    }

    handleInputForInputList(event){
        let word = event.currentTarget.value;
        this.setState({['inputValue']: word});
    }

    panelContent() {
        if (this.props.inputField && Object.values(this.props.data.subfacets).filter(i => i.count > 0).length > 9) {
            return (
                <div className={this.state.panelClass}>
                    <input className='input-list-search'
                           autoComplete="off"
                           list="inputList"
                           placeholder={ArchiveUtils.translate(this.props, 'enter_field')}
                           name={this.props.facet}
                           onInput={this.handleInputForInputList}
                           onChange={this.props.handleSubmit}/>
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
                <button className={this.state.class} lang={this.props.locale} onClick={this.handleClick}>
                    {this.props.data.descriptor[this.props.locale]}
                </button>
                {this.panelContent()}
            </div>
        )
    }

    renderOptions() {
        //let length = this.state.inputValue.length ;
        //let initals = subfacetsArray.map(i => localDescriptor(i).slice(0,length).toLowerCase());
        //let firstIndex = initals.indexOf(this.state.inputValue.toLowerCase());
        //let lastIndex = length === 0 ? 10 : initals.lastIndexOf(this.state.inputValue.toLowerCase());

        //return this.sortedSubfacets().slice(firstIndex, lastIndex + 1).map((subfacetId, index) => {
        return this.sortedSubfacets().slice(firstIndex, lastIndex + 1).map((subfacetId, index) => {
            const dataProps = {[`data-${this.props.facet}`]: `${subfacetId}`};
            return (
                <option key={"subfacet-" + index} {...dataProps}>
                {this.localDescriptor(subfacetId)}
                </option>
            )
        })
    }

    localDescriptor(subfacetId) {
        return this.props.data.subfacets[subfacetId].descriptor[this.props.locale];
    }

    sortedSubfacets() {
        let _this = this;
        return Object.keys(this.props.data.subfacets).sort(function (a, b) {
            return (_this.localDescriptor(a) > _this.localDescriptor(b)) ? 1 : ((_this.localDescriptor(b) > _this.localDescriptor(a)) ? -1 : 0);
        });
    }

    renderSubfacets() {
        return this.sortedSubfacets().map((subfacetId, index) => {
            if ((this.props.inputField && this.props.data.subfacets[subfacetId].count) || !this.props.inputField ) {
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
                               onChange={() => this.props.handleSubmit()}>
                        </input>
                        <label htmlFor={this.props.facet + "_" + subfacetId}>
                            {this.localDescriptor(subfacetId)}
                        </label>
                    </div>
                )
            }
        })
    }
}
