import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus } from 'react-icons/fa';

import YearRange from './YearRange';
import FacetFilterInput from './FacetFilterInput';
import SubFacets from './SubFacets';

export default function Facet({
    slider,
    data,
    facet,
    map,
    mapSearchQuery,
    query,
    locale,
    show,
    admin,
    sliderMin,
    sliderMax,
    currentMin,
    currentMax,
}) {
    const checkedFacets = map ?
        mapSearchQuery[`${facet}[]`] :
        query[`${facet}[]`];

    const [open, setOpen] = useState(checkedFacets?.length > 0);
    const [filter, setFilter] = useState('');

    function handleFilterChange(event) {
        event.preventDefault();
        setFilter(event.target.value);
    }

    function handleClick(event) {
        event.preventDefault();
        setOpen(prev => !prev);
    }

    if (slider) {
        const style = { width: 400, paddingLeft: 11, paddingRight: 15 };

        return (
            <div className="subfacet-container">
                <button
                    className={classNames('Button', 'accordion', { 'active': open })}
                    type="button"
                    onClick={handleClick}
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
                        <YearRange
                            sliderMin={sliderMin}
                            sliderMax={sliderMax}
                            currentMin={currentMin}
                            currentMax={currentMax}
                        />
                    </div>
                </div>
            </div>
        );
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
                    onClick={handleClick}
                >
                    {data.name[locale]}
                    {
                        open ?
                            <FaMinus className="Icon Icon--primary" /> :
                            <FaPlus className="Icon Icon--primary" />
                    }
                </button>

                <div className={classNames('panel', { 'open': open })}>
                    <div className="flyout-radio-container">
                        <FacetFilterInput
                            data={data}
                            facet={facet}
                            filter={filter}
                            onChange={handleFilterChange}
                        />
                        <SubFacets
                            data={data}
                            facet={facet}
                            filter={filter}
                            locale={locale}
                        />
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
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
};
