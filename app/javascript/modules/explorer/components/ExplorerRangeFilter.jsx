import { useRef, useState } from 'react';

import { useI18n } from 'modules/i18n';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaTimes } from 'react-icons/fa';

// rc-slider default handle radius (px) — accounts for track inset
const HANDLE_RADIUS = 7;

const Range = Slider.Range;

export function ExplorerRangeFilter({
    label,
    globalMin,
    globalMax,
    value,
    onChange,
}) {
    const { t, locale } = useI18n();
    const [min, max] = value;
    const isFiltered = min > globalMin || max < globalMax;
    const [hoverTooltip, setHoverTooltip] = useState(null);
    const wrapperRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const trackWidth = rect.width - HANDLE_RADIUS * 2;
        const fraction = Math.max(
            0,
            Math.min(1, (e.clientX - rect.left - HANDLE_RADIUS) / trackWidth)
        );
        const hoverValue = Math.round(
            globalMin + fraction * (globalMax - globalMin)
        );
        setHoverTooltip({ x: e.clientX - rect.left, value: hoverValue });
    };

    return (
        <div className="ExplorerSidebarSearch-rangeSection">
            <div className="ExplorerSidebarSearch-rangeLabel">
                <span>{label}</span>
                <span className="ExplorerSidebarSearch-rangeValues">
                    {formatNumber(min, 0, locale)}–
                    {formatNumber(max, 0, locale)}
                    {isFiltered && (
                        <button
                            className="ExplorerSidebarSearch-rangeReset"
                            type="button"
                            onClick={() => onChange([globalMin, globalMax])}
                            aria-label={[]
                                .concat(t('explorer.reset_filter', { label }))
                                .join('')}
                        >
                            <FaTimes />
                        </button>
                    )}
                </span>
            </div>
            <div
                ref={wrapperRef}
                className="ExplorerSidebarSearch-sliderWrapper"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverTooltip(null)}
            >
                {hoverTooltip && (
                    <div
                        className="ExplorerRangeFilter-hoverTooltip"
                        style={{ left: hoverTooltip.x }}
                    >
                        {hoverTooltip.value}
                    </div>
                )}
                <Range
                    min={globalMin}
                    max={globalMax}
                    value={value}
                    onChange={onChange}
                    step={1}
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
