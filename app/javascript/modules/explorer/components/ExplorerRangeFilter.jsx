import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaTimes } from 'react-icons/fa';

const Range = Slider.createSliderWithTooltip(Slider.Range);

export function ExplorerRangeFilter({
    label,
    globalMin,
    globalMax,
    value,
    onChange,
}) {
    const [min, max] = value;
    const isFiltered = min > globalMin || max < globalMax;

    return (
        <div className="ExplorerSidebarSearch-rangeSection">
            <div className="ExplorerSidebarSearch-rangeLabel">
                <span>{label}</span>
                <span className="ExplorerSidebarSearch-rangeValues">
                    {min}–{max}
                    {isFiltered && (
                        <button
                            className="ExplorerSidebarSearch-rangeReset"
                            type="button"
                            onClick={() => onChange([globalMin, globalMax])}
                            aria-label={`Reset ${label} filter`}
                        >
                            <FaTimes />
                        </button>
                    )}
                </span>
            </div>
            <div className="ExplorerSidebarSearch-sliderWrapper">
                <Range
                    min={globalMin}
                    max={globalMax}
                    value={value}
                    onChange={onChange}
                    step={1}
                    tipProps={{ placement: 'top' }}
                />
            </div>
        </div>
    );
}

ExplorerRangeFilter.propTypes = {
    label: PropTypes.string.isRequired,
    globalMin: PropTypes.number.isRequired,
    globalMax: PropTypes.number.isRequired,
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ExplorerRangeFilter;
