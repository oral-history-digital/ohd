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

    function onSliderChange(value) {
        setYearOfBirthRange(value[0], value[1]);
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
                <span>{yearOfBirthMin || sliderMin} - {yearOfBirthMax || sliderMax}</span>
            </div>
            <Range
                min={sliderMin}
                max={sliderMax}
                onChange={onSliderChange}
                allowCross
                marks={marks}
                tipProps={{placement: 'top'}}
                style={rangeStyle}
                value={[yearOfBirthMin || sliderMin, yearOfBirthMax || sliderMax]}
            />
        </div>
    );
}

YearRange.propTypes = {
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
};
