import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus } from 'react-icons/fa';

import YearRange from './YearRange';

export default function YearFacet({
    data,
    facet,
    map,
    mapSearchQuery,
    query,
    locale,
    sliderMin,
    sliderMax,
}) {
    const checkedFacets = map ?
        mapSearchQuery[`${facet}[]`] :
        query[`${facet}[]`];

    const [open, setOpen] = useState(checkedFacets?.length > 0);

    function handleClick(event) {
        event.preventDefault();
        setOpen(prev => !prev);
    }

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
                    />
                </div>
            </div>
        </div>
    );
}

YearFacet.propTypes = {
    facet: PropTypes.string,
    locale: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
    map: PropTypes.bool,
    mapSearchQuery: PropTypes.object,
    query: PropTypes.object,
};
