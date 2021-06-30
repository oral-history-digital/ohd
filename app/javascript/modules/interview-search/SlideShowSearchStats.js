import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';

export default function SlideShowSearchStats({
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
    const observations = searchResults.foundObservations;

    const filteredSegments = segments.filter(segment => segment.text[locale] !== '');
    const toc = segments.filter(segment => segment.text[locale] === '');

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
                    observations.length > 0 && (
                        <li className="SearchStats-item">
                            {observations.length} {t('observation_results')}
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
