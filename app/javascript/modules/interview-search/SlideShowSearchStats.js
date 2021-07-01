import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function SlideShowSearchStats({
    searchResults,
}) {
    const { t } = useI18n();

    if (!searchResults) {
        return null;
    }

    const segments = searchResults.foundSegments;
    const headings = searchResults.foundHeadings;
    const annotations = searchResults.foundAnnotations;
    const registryEntries = searchResults.foundRegistryEntries;
    const biographicalEntries = searchResults.foundBiographicalEntries;
    const photos = searchResults.foundPhotos;
    const observations = searchResults.foundObservations;

    return (
        <div className="SearchStats">
            <h3 className="SearchStats-heading">
                {t('modules.interview_search.search_results.heading')}
            </h3>
            <ul className="SearchStats-list">
                {
                    segments.length > 0 && (
                        <li className="SearchStats-item">
                            {segments.length} {t('modules.interview_search.search_results.in_transcript')}
                        </li>
                    )
                }
                {
                    headings.length > 0 && (
                        <li className="SearchStats-item">
                            {headings.length} {t('modules.interview_search.search_results.in_toc')}
                        </li>
                    )
                }
                {
                    annotations.length > 0 && (
                        <li className="SearchStats-item">
                            {annotations.length} {t('modules.interview_search.search_results.in_annotations')}
                        </li>
                    )
                }
                {
                    registryEntries.length > 0 && (
                        <li className="SearchStats-item">
                            {registryEntries.length} {t('modules.interview_search.search_results.in_registry')}
                        </li>
                    )
                }
                {
                    biographicalEntries.length > 0 && (
                        <li className="SearchStats-item">
                            {biographicalEntries.length} {t('modules.interview_search.search_results.in_biography')}
                        </li>
                    )
                }
                {
                    photos.length > 0 && (
                        <li className="SearchStats-item">
                            {photos.length} {t('modules.interview_search.search_results.in_photo_captions')}
                        </li>
                    )
                }
                {
                    observations.length > 0 && (
                        <li className="SearchStats-item">
                            {observations.length} {t('modules.interview_search.search_results.in_observations')}
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

SlideShowSearchStats.propTypes = {
    searchResults: PropTypes.object,
};
