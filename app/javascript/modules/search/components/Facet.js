import { Component } from 'react';
import classNames from 'classnames';
import { FaInfoCircle, FaExternalLinkAlt, FaSearch, FaPlus, FaMinus }
    from 'react-icons/fa';

import YearRangeContainer from './YearRangeContainer';

export default class Facet extends Component {

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
        const { data, facet } = this.props;

        // filter only where size of list >= 15
        if (Object.keys(data.subfacets).length >= 15) {
            return(
                <div className="facet-filter">
                    <FaSearch className="Icon Icon--primary Icon--small" />
                    <input
                        type="text"
                        className={classNames('filter', facet)}
                        value={this.state.filter}
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
                        {
                            this.state.open ?
                                <FaMinus className="Icon Icon--primary" /> :
                                <FaPlus className="Icon Icon--primary" />
                        }
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
                        {
                            this.state.open ?
                                <FaMinus className="Icon Icon--primary" /> :
                                <FaPlus className="Icon Icon--primary" />
                        }
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
        const { locale } = this.props;

        if (subfacet.homepage && subfacet.homepage[locale]) {
            // apend 'http://' to homepage if not present
            let href = /^http/.test(subfacet.homepage[locale]) ? subfacet.homepage[locale] : `http://${subfacet.homepage[locale]}`
            return (
                <a href={href} title={subfacet.homepage[locale]} target="_blank" rel="noreferrer">
                    <FaExternalLinkAlt className="Icon Icon--unobtrusive" />
                </a>
            )
        }
    }

    renderCollectionInfo(subfacet) {
        const { facet, locale } = this.props;

        if (facet === 'collection_id' && (subfacet.notes || subfacet.homepage)) {
            return (
                <span>
                    <FaInfoCircle
                        className="Icon Icon--unobtrusive u-mr-tiny"
                        title={subfacet.notes[locale]}
                    />
                    {this.collectionLink(subfacet)}
                </span>
            )
        }
    }

    renderSubfacets() {
        const { facet } = this.props;

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
                    <div
                        key={index}
                        className={classNames('subfacet-entry', {
                            'checked': checkedState,
                        })}
                    >
                        <input
                            className={classNames('with-font', this.props.facet, 'checkbox')}
                            id={this.props.facet + "_" + subfacetId}
                            name={this.props.facet + "[]"} checked={checkedState} type="checkbox"
                            value={subfacetId}
                            onChange={() => this.props.handleSubmit()}
                        />
                        {' '}
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
