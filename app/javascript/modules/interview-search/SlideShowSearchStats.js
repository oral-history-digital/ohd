import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

function getNumObservationsResults(observations, searchTerm) {
    if (searchTerm === '') {
        return 0;
    }

    const regex = new RegExp(searchTerm, 'gi');
    const matches = observations.match(regex);

    if (matches === null) {
        return 0;
    }

    return matches.length;
}

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

    const numObservationsResults = observations && searchTerm ?
        getNumObservationsResults(observations, searchTerm) :
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
                    numObservationsResults > 0 && (
                        <li className="SearchStats-item">
                            {numObservationsResults} {t('observation_results')}
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
