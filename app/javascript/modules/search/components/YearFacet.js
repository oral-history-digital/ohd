import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import YearRange from './YearRange';

export default function YearFacet({
    data,
    sliderMin,
    sliderMax,
}) {
    const { locale } = useI18n();

    const [open, setOpen] = useState(false);

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
    data: PropTypes.object.isRequired,
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
};
