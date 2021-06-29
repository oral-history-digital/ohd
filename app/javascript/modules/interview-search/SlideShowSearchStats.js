import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { numObservationsResults } from 'modules/search';

export default function SlideShowSearchStats({
    interview,
    searchResults,
}) {
    const { t, locale } = useI18n();

    if (!searchResults) {
        return null;
    }

    const segments = searchResults.foundSegments;
    const annotations = searchResults.foundAnnotations;
    const registryEntries = searchResults.foundRegistryEntries;
    const biographicalEntries = searchResults.foundBiographicalEntries;
    const photos = searchResults.foundPhotos;

    const filteredSegments = segments.filter(segment => segment.text[locale] !== '');
    const toc = segments.filter(segment => segment.text[locale] === '');

    const observations = interview.observations[locale];
    const searchTerm = searchResults.fulltext;

    const numObsResults = observations && searchTerm ?
        numObservationsResults(observations, searchTerm) :
        0;

    return (
        <div className="SearchStats">
            <ul className="SearchStats-list">
                {
                    filteredSegments.length > 0 && (
                        <li className="SearchStats-item">
                            {filteredSegments.length} {t('segment_results')}
                        </li>
                    )
                }
                {
                    toc.length > 0 && (
                        <li className="SearchStats-item">
                            {toc.length} {t('heading_results')}
                        </li>
                    )
                }
                {
                    annotations.length > 0 && (
                        <li className="SearchStats-item">
                            {annotations.length} {t('annotation_results')}
                        </li>
                    )
                }
                {
                    registryEntries.length > 0 && (
                        <li className="SearchStats-item">
                            {registryEntries.length} {t('registryentry_results')}
                        </li>
                    )
                }
                {
                    biographicalEntries.length > 0 && (
                        <li className="SearchStats-item">
                            {biographicalEntries.length} {t('biographicalentry_results')}
                        </li>
                    )
                }
                {
                    photos.length > 0 && (
                        <li className="SearchStats-item">
                            {photos.length} {t('photo_results')}
                        </li>
                    )
                }
                {
                    numObsResults > 0 && (
                        <li className="SearchStats-item">
                            {numObsResults} {t('observation_results')}
                        </li>
                    )
                }
            </ul>
        </div>
    );
}

SlideShowSearchStats.propTypes = {
    interview: PropTypes.object.isRequired,
    searchResults: PropTypes.object,
};
