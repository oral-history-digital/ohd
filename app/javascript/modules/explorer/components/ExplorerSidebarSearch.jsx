import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useMatch, useSearchParams } from 'react-router-dom';

import { useExplorerInterviewRange } from '../hooks';
import { applyInterviewRangeParams, applyQueryParam } from '../utils';

const Range = Slider.createSliderWithTooltip(Slider.Range);

export function ExplorerSidebarSearch() {
    const match = useMatch('/:locale/explorer/*');
    const [searchParams, setSearchParams] = useSearchParams();
    const { globalMin, globalMax } = useExplorerInterviewRange();

    const query = searchParams.get('explorer_q') || '';
    const interviewMin =
        Number(searchParams.get('explorer_interviews_min')) || globalMin;
    const interviewMax =
        Number(searchParams.get('explorer_interviews_max')) || globalMax;

    if (!match) return null;

    const handleQueryChange = (e) =>
        setSearchParams((prev) => applyQueryParam(prev, e.target.value), {
            replace: true,
        });

    const handleClear = () =>
        setSearchParams((prev) => applyQueryParam(prev, ''), { replace: true });

    const handleInterviewRangeChange = ([min, max]) =>
        setSearchParams(
            (prev) =>
                applyInterviewRangeParams(prev, min, max, globalMin, globalMax),
            { replace: true }
        );

    const isRangeFiltered =
        interviewMin > globalMin || interviewMax < globalMax;

    return (
        <div className="ExplorerSidebarSearch">
            <div className="ExplorerSidebarSearch-inputWrapper">
                <FaSearch className="ExplorerSidebarSearch-icon" />
                <input
                    className="ExplorerSidebarSearch-input"
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Search archives &amp; institutions…"
                />
                {query && (
                    <button
                        className="ExplorerSidebarSearch-clear"
                        onClick={handleClear}
                        aria-label="Clear search"
                        type="button"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <div className="ExplorerSidebarSearch-rangeSection">
                <div className="ExplorerSidebarSearch-rangeLabel">
                    <span>Interviews</span>
                    <span className="ExplorerSidebarSearch-rangeValues">
                        {interviewMin}–{interviewMax}
                        {isRangeFiltered && (
                            <button
                                className="ExplorerSidebarSearch-rangeReset"
                                type="button"
                                onClick={() =>
                                    handleInterviewRangeChange([
                                        globalMin,
                                        globalMax,
                                    ])
                                }
                                aria-label="Reset interview filter"
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
                        value={[interviewMin, interviewMax]}
                        onChange={handleInterviewRangeChange}
                        step={1}
                        tipProps={{ placement: 'top' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ExplorerSidebarSearch;
