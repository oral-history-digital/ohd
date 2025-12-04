import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import getRangeMarks from './getRangeMarks';

const Range = Slider.createSliderWithTooltip(Slider.Range);

export default function YearRange({
    currentValue,
    onChange,
    onAfterChange,
    sliderMin,
    sliderMax,
}) {
    const alignRangeStyles = {
        paddingLeft: '7px',
        paddingRight: '7px',
    };

    return (
        <div className="flyout-radio-container">
            <div className="u-mb">
                {currentValue
                    ? `${currentValue[0]}–${currentValue[1]}`
                    : `${sliderMin}–${sliderMax}`}
            </div>
            <div style={alignRangeStyles}>
                <Range
                    min={sliderMin}
                    max={sliderMax}
                    onChange={onChange}
                    onAfterChange={onAfterChange}
                    marks={getRangeMarks(sliderMin, sliderMax)}
                    step={1}
                    tipProps={{ placement: 'top' }}
                    value={currentValue || [sliderMin, sliderMax]}
                />
            </div>
        </div>
    );
}

YearRange.propTypes = {
    currentValue: PropTypes.array,
    sliderMin: PropTypes.number,
    sliderMax: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onAfterChange: PropTypes.func.isRequired,
};
