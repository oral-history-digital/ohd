import { useEffect, useRef, useState } from 'react';

import { AuthShowContainer } from 'modules/auth';
import { useSearchParams } from 'modules/query-string';
import { ResetFiltersButton } from 'modules/ui';
import { isMobile } from 'modules/user-agent';
import PropTypes from 'prop-types';

import defaultSortOptions from '../defaultSortOptions';
import ArchiveFacets from './ArchiveFacets';
import ArchiveSearchFormInput from './ArchiveSearchFormInput';

export default function ArchiveSearchForm({ projectId, project, hideSidebar }) {
    const formEl = useRef(null);

    const {
        fulltext,
        fulltextIsSet,
        facets,
        yearOfBirthMin,
        yearOfBirthMax,
        interviewYearMin,
        interviewYearMax,
        setFulltextAndSort,
        resetSearchParams,
    } = useSearchParams();

    const [fulltextInput, setFulltextInput] = useState(fulltext);

    useEffect(() => {
        setFulltextInput(fulltext || '');
    }, [fulltext]);

    const hasFacetFilters = Object.values(facets).some((value) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== null && value !== '';
    });
    const hasBirthYearFilter =
        !Number.isNaN(yearOfBirthMin) || !Number.isNaN(yearOfBirthMax);
    const hasInterviewYearFilter =
        !Number.isNaN(interviewYearMin) || !Number.isNaN(interviewYearMax);
    const hasActiveFilters =
        fulltextIsSet ||
        hasFacetFilters ||
        hasBirthYearFilter ||
        hasInterviewYearFilter;

    function handleReset() {
        resetSearchParams();

        if (isMobile()) {
            hideSidebar();
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const searchTerm = fulltextInput?.trim();

        if (searchTerm?.length > 0) {
            setFulltextAndSort(searchTerm, 'score', 'desc');
        } else {
            setFulltextInput('');

            // Set defaults.
            const defaults = defaultSortOptions(project?.default_search_order);
            setFulltextAndSort(undefined, defaults.sort, defaults.order);
        }

        if (isMobile()) {
            hideSidebar();
        }
    }

    return (
        <div className="ArchiveSearchForm">
            {hasActiveFilters && (
                <div className="ResetFiltersButton-container">
                    <ResetFiltersButton onClick={handleReset} />
                </div>
            )}
            <form
                ref={formEl}
                id="archiveSearchForm"
                className="flyout-search"
                onSubmit={handleSubmit}
            >
                {projectId === 'mog' ? (
                    <ArchiveSearchFormInput
                        value={fulltextInput}
                        projectId={projectId}
                        onChange={setFulltextInput}
                    />
                ) : (
                    <AuthShowContainer hasProjectAccess ifCatalog ifNoProject>
                        <ArchiveSearchFormInput
                            value={fulltextInput}
                            projectId={projectId}
                            onChange={setFulltextInput}
                        />
                    </AuthShowContainer>
                )}

                <ArchiveFacets />
            </form>
        </div>
    );
}

ArchiveSearchForm.propTypes = {
    projectId: PropTypes.string,
    project: PropTypes.object,
    hideSidebar: PropTypes.func.isRequired,
};
