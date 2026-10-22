import { useEffect, useRef, useState } from 'react';

import { useTrackSiteSearch } from 'modules/analytics';
import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification, ResetFiltersButton } from 'modules/ui';
import { isMobile } from 'modules/user-agent';
import PropTypes from 'prop-types';

import defaultSortOptions from '../defaultSortOptions';
import ArchiveFacets from './ArchiveFacets';
import ArchiveSearchFormInput from './ArchiveSearchFormInput';

/**
 * Shows search input and facets, using Redux project settings when clearing fulltext search.
 *
 * @param {Object} props - Form properties.
 * @param {string} [props.projectId] - Project shortname used for input behavior.
 * @param {Function} props.hideSidebar - Closes the sidebar on mobile devices.
 * @returns {React.ReactElement} Search form or its project loading/error state.
 */
export default function ArchiveSearchForm({ projectId, hideSidebar }) {
    const { project, isLoading, error } = useProject();
    const { t } = useI18n();
    const formEl = useRef(null);
    const trackSiteSearch = useTrackSiteSearch();

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

            trackSiteSearch(searchTerm);
        } else {
            setFulltextInput('');

            // Set defaults.
            const defaults = defaultSortOptions(project.default_search_order);
            setFulltextAndSort(undefined, defaults.sort, defaults.order);
        }

        if (isMobile()) {
            hideSidebar();
        }
    }

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;

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
    hideSidebar: PropTypes.func.isRequired,
};
