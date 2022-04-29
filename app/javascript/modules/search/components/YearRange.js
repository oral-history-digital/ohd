import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
// TODO: this does not work
import 'rc-slider/assets/index.css';

import useSearchParams from '../useSearchParams';

const Range = Slider.createSliderWithTooltip(Slider.Range);
const rangeStyle = { width: 318 };
const style = { paddingBottom: 20, marginLeft: -11};
const INTERVAL = 5;

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

    let marks = {};
    for (var i = (sliderMin + 1); i < sliderMax; i++) {
        // set a mark every interval'th year. default is 5
        if (i % INTERVAL === 0 ) {
            marks[i] = i;
        }
    }
    // set min and max values as additional marks
    marks[sliderMin] = sliderMin;
    marks[sliderMax] = sliderMax;

    return (
        <div>
            <div style={style} className="year-range-state">
                <span>{currentValue[0] || sliderMin} - {currentValue[1] || sliderMax}</span>
            </div>
            <Range
                min={sliderMin}
                max={sliderMax}
                onChange={setCurrentValue}
                onAfterChange={handleCompleteChange}
                allowCross
                marks={marks}
                tipProps={{placement: 'top'}}
                style={rangeStyle}
                value={[currentValue[0] || sliderMin, currentValue[1] || sliderMax]}
            />
        </div>
    );
}

YearRange.propTypes = {
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
};
