import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaInfoCircle, FaExternalLinkAlt, FaSearch, FaPlus, FaMinus }
    from 'react-icons/fa';

import { Checkbox } from 'modules/ui';
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
            filter: "",
        };
    }

    checkedFacets() {
        const { map, mapSearchQuery, query, facet } = this.props;

        if (map){
            return mapSearchQuery[`${facet}[]`];
        } else {
            return query[`${facet}[]`];
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
        const { open } = this.state;

        event?.preventDefault()

        if (open) {
            this.setState({ open: false });
        } else {
            this.setState({ open: true });
        }
    }

    filterInput() {
        const { data, facet } = this.props;
        const { filter } = this.state;

        // filter only where size of list >= 15
        if (Object.keys(data.subfacets).length >= 15) {
            return(
                <div className="facet-filter">
                    <FaSearch className="Icon Icon--primary Icon--small" />
                    <input
                        type="text"
                        className={classNames('filter', facet)}
                        value={filter}
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
        const { open } = this.state;

        return (
            <div className={classNames('panel', { 'open': open })}>
                <div className="flyout-radio-container">
                    {this.filterInput()}
                    {this.renderSubfacets()}
                </div>
            </div>
        )
    }

    render() {
        const { slider, data, locale, show, admin,
            sliderMin, sliderMax, currentMin, currentMax,
            handleSubmit } = this.props;
        const { open } = this.state;

        if (slider) {
            let style = { width: 400, paddingLeft: 11, paddingRight: 15 };
            return (
                <div className="subfacet-container">
                    <button
                        className={classNames('Button', 'accordion', { 'active': open })}
                        type="button"
                        onClick={this.handleClick}
                    >
                        {data.name[locale]}
                        {
                            open ?
                                <FaMinus className="Icon Icon--primary" /> :
                                <FaPlus className="Icon Icon--primary" />
                        }
                    </button>
                    <div
                        style={style}
                        className={classNames('panel', { 'open': open })}
                    >
                        <div className="flyout-radio-container">
                            <YearRangeContainer
                                sliderMin={sliderMin}
                                sliderMax={sliderMax}
                                currentMin={currentMin}
                                currentMax={currentMax}
                                onChange={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
                )
        }
        else if (show) {
            return (
                <div className="subfacet-container">
                    <button
                        type="button"
                        className={classNames('Button', 'accordion', {
                            'active': open,
                            'admin': admin,
                        })}
                        onClick={this.handleClick}
                    >
                        {data.name[locale]}
                        {
                            open ?
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
        const { data, locale } = this.props;

        return data.subfacets[subfacetId].name[locale];
    }

    priority(subfacetId) {
        const { data } = this.props;

        return data.subfacets[subfacetId].priority;
    }

    sortedSubfacets() {
        const { data } = this.props;

        let _this = this;
        // if the Facet is about time periods, sort by years ( by doing: .replace(/[^\d]/g, '') )
        if (data.name['de'] && data.name['de'].trim() === 'Zeitperioden') {
            return Object.keys(data.subfacets).sort(function (a, b) {
                return (_this.localDescriptor(a).replace(/[^\d]/g, '') > _this.localDescriptor(b).replace(/[^\d]/g, '')) ? 1 : ((_this.localDescriptor(b).replace(/[^\d]/g, '') > _this.localDescriptor(a).replace(/[^\d]/g, '')) ? -1 : 0);
            })
        }
        // everything else
        // sort first alphabetically, then put prioritized down in the list (like "others"/"sonstige")
        else {
            return Object.keys(data.subfacets).sort(function (a, b) {
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
        const { data, facet, locale, handleSubmit } = this.props;

        return this.sortedSubfacets().filter(subfacetId => {
            let subfacetName = data.subfacets[subfacetId].name[locale];
            if (subfacetName) {
                return subfacetName.toLowerCase().includes(this.state.filter.toLowerCase());
            }
        }).map((subfacetId, index) => {
            if ((this.props.inputField && data.subfacets[subfacetId].count) || !this.props.inputField ) {
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
                        <Checkbox
                            className={classNames('Input', 'with-font', facet, 'checkbox')}
                            id={facet + "_" + subfacetId}
                            name={facet + "[]"}
                            checked={checkedState}
                            value={subfacetId}
                            onChange={handleSubmit}
                        />
                        {' '}
                        <label htmlFor={facet + "_" + subfacetId}>
                            {this.localDescriptor(subfacetId)}
                            <span className='flyout-radio-container-facet-count'>({data.subfacets[subfacetId].count})</span>
                        </label>
                        &nbsp;
                        {this.renderCollectionInfo(data.subfacets[subfacetId])}
                    </div>
                )
            }
        })
    }
}

Facet.propTypes = {
    facet: PropTypes.string,
    slider: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    admin: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
    currentMin: PropTypes.number,
    currentMax: PropTypes.number,
    map: PropTypes.bool,
    mapSearchQuery: PropTypes.object,
    query: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
};
