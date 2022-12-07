import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { useSearchParams } from 'modules/query-string';
import getRangeMarks from './getRangeMarks';

const Range = Slider.createSliderWithTooltip(Slider.Range);

export default function YearRange({
    sliderMin,
    sliderMax,
}) {
    const { yearOfBirthMin, yearOfBirthMax, setYearOfBirthRange } = useSearchParams();
    const [currentValue, setCurrentValue] = useState([yearOfBirthMin,
        yearOfBirthMax]);

    useEffect(() => {
        setCurrentValue([yearOfBirthMin, yearOfBirthMax]);
    }, [yearOfBirthMin, yearOfBirthMax]);

    function handleCompleteChange() {
        setYearOfBirthRange(...currentValue);
    }

    const alignRangeStyles = {
        paddingLeft: '7px',
        paddingRight: '7px'
    };

    return (
        <>
            <div className="u-mb">
                {currentValue[0] || sliderMin}–{currentValue[1] || sliderMax}
            </div>
            <div style={alignRangeStyles}>
                <Range
                    min={sliderMin}
                    max={sliderMax}
                    onChange={setCurrentValue}
                    onAfterChange={handleCompleteChange}
                    marks={getRangeMarks(sliderMin, sliderMax)}
                    step={1}
                    tipProps={{placement: 'top'}}
                    value={[currentValue[0] || sliderMin, currentValue[1] || sliderMax]}
                />
            </div>
        </>
    );
}

YearRange.propTypes = {
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
};
