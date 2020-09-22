import React from 'react';
import YearRangeContainer from "../containers/YearRangeContainer";

export default class Facet extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClick = this.handleClick.bind(this);
        let openState = false;
        if (this.checkedFacets()) {
            openState = this.checkedFacets().length > 0;
        }

        this.state = {
            inputValue: "",
            open: openState,
            class: openState ? "accordion active" : "accordion",
            panelClass: openState ? "panel open" : "panel",
            filter: "",
        };
    }

    checkedFacets() {
        if(this.props.map){
            return this.props.mapSearchQuery[`${this.props.facet}[]`];
        } else {
            return this.props.query[`${this.props.facet}[]`];
        }
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({filter: event.target.value});
    }

    handleKeyDown(event) {
        if (event.keyCode == 13) event.preventDefault();;
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

    filterInput() {
        // filter only where size of list >= 15
        if (Object.keys(this.props.data.subfacets).length >= 15) {
            return(
                <div className={'facet-filter'}>
                    <i className="fa fa-search"></i>
                    <input type='text' className={'filter ' + this.props.facet} value={this.state.filter}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    style={{borderBottom: '1px solid ', marginBottom: '0.7rem'}}
                    />
                </div>
            )
        } else {
            return null;
        }
    }

    panelContent() {
        return (
            <div className={this.state.panelClass}>
                <div className="flyout-radio-container">
                    {this.filterInput()}
                    {this.renderSubfacets()}
                </div>
            </div>
        )
    }

    render() {
        if (this.props.slider) {
            let style = { width: 400, paddingLeft: 11, paddingRight: 15 };
            return (
                <div className="subfacet-container">
                    <button className={this.state.class} lang={this.props.locale} onClick={this.handleClick}>
                        {this.props.data.name[this.props.locale]}
                    </button>
                    <div style={style} className={this.state.panelClass}>
                        <div className="flyout-radio-container">
                            <YearRangeContainer 
                                sliderMin={this.props.sliderMin}
                                sliderMax={this.props.sliderMax}
                                currentMin={this.props.currentMin}
                                currentMax={this.props.currentMax}
                                onChange={this.props.handleSubmit}
                            />
                        </div>
                    </div>
                </div>
                )
        }
        else if (this.props.show) {
            return (
                <div className="subfacet-container">
                    <button className={`${this.state.class} ${this.props.admin ? 'admin' : ''}`} lang={this.props.locale} onClick={this.handleClick}>
                        {this.props.data.name[this.props.locale]}
                    </button>
                    {this.panelContent()}
                </div>
            )
        } else {
            return null;
        }
    }

    localDescriptor(subfacetId) {
        return this.props.data.subfacets[subfacetId].name[this.props.locale];
    }

    priority(subfacetId) {
        return this.props.data.subfacets[subfacetId].priority;
    }

    sortedSubfacets() {
        let _this = this;
        // if the Facet is about time periods, sort by years ( by doing: .replace(/[^\d]/g, '') )
        if(this.props.data.name['de'] && this.props.data.name['de'].trim() === 'Zeitperioden') {
            return Object.keys(this.props.data.subfacets).sort(function (a, b) {
                return (_this.localDescriptor(a).replace(/[^\d]/g, '') > _this.localDescriptor(b).replace(/[^\d]/g, '')) ? 1 : ((_this.localDescriptor(b).replace(/[^\d]/g, '') > _this.localDescriptor(a).replace(/[^\d]/g, '')) ? -1 : 0);
            })
        }
        // everything else
        // sort first alphabetically, then put prioritized down in the list (like "others"/"sonstige")
        else {
            return Object.keys(this.props.data.subfacets).sort(function (a, b) {
                return (_this.localDescriptor(a) > _this.localDescriptor(b)) ? 1 : ((_this.localDescriptor(b) > _this.localDescriptor(a)) ? -1 : 0);
            }).sort(function (a, b) {
                return (_this.priority(a) > _this.priority(b)) ? 1 : ((_this.priority(b) > _this.priority(a)) ? -1 : 0);
            });
        }
    }

    collectionLink(subfacet) {
        if (subfacet.homepage && subfacet.homepage[this.props.locale]) {
            // apend 'http://' to homepage if not present
            let href = /^http/.test(subfacet.homepage[this.props.locale]) ? subfacet.homepage[this.props.locale] : `http://${subfacet.homepage[this.props.locale]}`
            return (
                <a href={href} title={subfacet.homepage[this.props.locale]} target='_blank' rel="noopener">
                    <i className="fa fa-external-link" aria-hidden="true"  style={{'color': 'grey'}} />
                </a>
            )
        }
    }

    renderCollectionInfo(subfacet) {
        if(this.props.facet === 'collection_id' && (subfacet.notes || subfacet.homepage)) {
            return (
                <span>
                    <i className="fa fa-info-circle" aria-hidden="true" title={subfacet.notes[this.props.locale]}  style={{'color': 'grey'}} />
                    {this.collectionLink(subfacet)}
                </span>
            )
        }
    }

    renderSubfacets() {
        return this.sortedSubfacets().filter(subfacetId => {
            let subfacetName = this.props.data.subfacets[subfacetId].name[this.props.locale];
            if (subfacetName) {
                return subfacetName.toLowerCase().includes(this.state.filter.toLowerCase());
            }
        }).map((subfacetId, index) => {
            if ((this.props.inputField && this.props.data.subfacets[subfacetId].count) || !this.props.inputField ) {
                let checkedState = false;
                if (this.checkedFacets()) {
                    checkedState = this.checkedFacets().indexOf(subfacetId.toString()) > -1;
                }
                return (
                    <div key={"subfacet-" + index} className={'subfacet-entry' + (checkedState ? ' checked' : '')}>
                        <input className={'with-font ' + this.props.facet + ' checkbox'}
                               id={this.props.facet + "_" + subfacetId}
                               name={this.props.facet + "[]"} checked={checkedState} type="checkbox"
                               value={subfacetId}
                               onChange={() => this.props.handleSubmit()}>
                        </input>
                        <label htmlFor={this.props.facet + "_" + subfacetId}>
                            {this.localDescriptor(subfacetId)}
                            <span className='flyout-radio-container-facet-count'>({this.props.data.subfacets[subfacetId].count})</span>
                        </label>
                        &nbsp;
                        {this.renderCollectionInfo(this.props.data.subfacets[subfacetId])}
                    </div>
                )
            }
        })
    }
}
