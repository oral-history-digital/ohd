import { useGetArchives } from 'modules/data';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useMatch, useSearchParams } from 'react-router-dom';

import {
    useExplorerArchiveInstitutions,
    useExplorerInterviewRange,
    useExplorerYearRange,
} from '../hooks';
import {
    applyInstitutionParam,
    applyInterviewRangeParams,
    applyQueryParam,
    applyYearRangeParams,
} from '../utils';
import { InstitutionDropdown } from './InstitutionDropdown';

const Range = Slider.createSliderWithTooltip(Slider.Range);

// TODO: Split this container into ExplorerSearchInput, ExplorerRangeFilter, and
// ExplorerInstitutionFilter subcomponents while keeping URL param orchestration here.
export function ExplorerSidebarSearch() {
    const match = useMatch('/:locale/explorer/*');
    const [searchParams, setSearchParams] = useSearchParams();
    const { archives } = useGetArchives();
    const { globalMin, globalMax } = useExplorerInterviewRange({
        archives,
        institutions: [],
    });
    const { globalYearMin, globalYearMax } = useExplorerYearRange({
        archives,
    });
    const institutions = useExplorerArchiveInstitutions({
        archives,
    });

    const tabIndex = Number(searchParams.get('explorer_tab')) || 0;
    const isArchivesTab = tabIndex === 0;

    const query = searchParams.get('explorer_q') || '';
    const interviewMin =
        Number(searchParams.get('explorer_interviews_min')) || globalMin;
    const interviewMax =
        Number(searchParams.get('explorer_interviews_max')) || globalMax;
    const yearMin =
        Number(searchParams.get('explorer_year_min')) || globalYearMin;
    const yearMax =
        Number(searchParams.get('explorer_year_max')) || globalYearMax;
    const institutionIds = searchParams.has('explorer_institution')
        ? searchParams
              .get('explorer_institution')
              .split(',')
              .map(Number)
              .filter(Boolean)
        : [];

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

    const handleYearRangeChange = ([min, max]) =>
        setSearchParams(
            (prev) =>
                applyYearRangeParams(
                    prev,
                    min,
                    max,
                    globalYearMin,
                    globalYearMax
                ),
            { replace: true }
        );

    const handleInstitutionChange = (id) => {
        const next = institutionIds.includes(id)
            ? institutionIds.filter((x) => x !== id)
            : [...institutionIds, id];
        setSearchParams((prev) => applyInstitutionParam(prev, next), {
            replace: true,
        });
    };

    const handleInstitutionClearAll = () =>
        setSearchParams((prev) => applyInstitutionParam(prev, []), {
            replace: true,
        });

    const isInterviewRangeFiltered =
        interviewMin > globalMin || interviewMax < globalMax;
    const isYearRangeFiltered =
        yearMin > globalYearMin || yearMax < globalYearMax;

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
                        {isInterviewRangeFiltered && (
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

            {isArchivesTab && globalYearMin !== null && (
                <div className="ExplorerSidebarSearch-rangeSection">
                    <div className="ExplorerSidebarSearch-rangeLabel">
                        <span>Publication year</span>
                        <span className="ExplorerSidebarSearch-rangeValues">
                            {yearMin}–{yearMax}
                            {isYearRangeFiltered && (
                                <button
                                    className="ExplorerSidebarSearch-rangeReset"
                                    type="button"
                                    onClick={() =>
                                        handleYearRangeChange([
                                            globalYearMin,
                                            globalYearMax,
                                        ])
                                    }
                                    aria-label="Reset year filter"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </span>
                    </div>
                    <div className="ExplorerSidebarSearch-sliderWrapper">
                        <Range
                            min={globalYearMin}
                            max={globalYearMax}
                            value={[yearMin, yearMax]}
                            onChange={handleYearRangeChange}
                            step={1}
                            tipProps={{ placement: 'top' }}
                        />
                    </div>
                </div>
            )}

            {isArchivesTab && (
                <div className="ExplorerSidebarSearch-institutionSection">
                    <div className="ExplorerSidebarSearch-rangeLabel">
                        <span>Institution</span>
                    </div>
                    <InstitutionDropdown
                        institutions={institutions}
                        values={institutionIds}
                        onChange={handleInstitutionChange}
                        onClearAll={handleInstitutionClearAll}
                    />
                </div>
            )}
        </div>
    );
}

export default ExplorerSidebarSearch;
