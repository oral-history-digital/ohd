import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { showTranslationTab } from 'modules/interview';
import { searchResultCount } from 'modules/interview-preview';
import ResultList from './ResultList';
import TranscriptResult from './TranscriptResult';
import AnnotationResult from './AnnotationResult';
import RegistryResult from './RegistryResult';
import PhotoResult from './PhotoResult';
import TocResult from './TocResult';

export default function InterviewSearchResults({
    interview,
    locale,
    projectId,
    currentInterviewSearchResults,
    segmentResults,
    headingResults,
    registryEntryResults,
    photoResults,
    biographyResults,
    annotationResults,
    observationsResults,
}) {
    const { t } = useI18n();

    const numResults = searchResultCount(currentInterviewSearchResults);

    if (numResults === 0) {
        return (
            <div>{t('modules.interview_search.no_results')}</div>
        );
    }

    const locales = interview.languages;
    const interviewLang = interview.lang;

    const resultsPerLocale = locales.map(resultLocale => [
        resultLocale,
        segmentResults.filter(segment => segment.text[resultLocale]?.length > 0),
    ])
        .filter(([_, results]) => results.length > 0)
        .filter(([resultLocale, _]) => resultLocale === interviewLang || showTranslationTab(projectId, interviewLang, locale));

    return (
        <div>
            {
                resultsPerLocale.map(([resultLocale, results]) => {
                    const heading = resultLocale === interviewLang ?
                        t('segment_results') :
                        t('translation_results');
                    return (
                        <ResultList
                            key={resultLocale}
                            heading={heading}
                            searchResults={results}
                            component={TranscriptResult}
                            locale={resultLocale}
                            className="u-mt"
                        />
                    );
                })
            }
            {headingResults.length > 0 && (
                <ResultList
                    heading={t('heading_results')}
                    searchResults={headingResults}
                    component={TocResult}
                    className="u-mt"
                />
            )}
            {annotationResults.length > 0 && (
                <ResultList
                    heading={t('annotation_results')}
                    searchResults={annotationResults}
                    component={AnnotationResult}
                    className="u-mt"
                />
            )}
            {registryEntryResults.length > 0 && (
                <ResultList
                    heading={t('registryentry_results')}
                    searchResults={registryEntryResults}
                    component={RegistryResult}
                    className="u-mt"
                />
            )}
            {biographyResults.length > 0 && (
                <p className="u-mt u-ml" style={{ fontSize: '1rem', lineHeight: '1.5rem' }}>
                    {`${biographyResults.length} ${t('biographicalentry_results')}`}
                </p>
            )}
            {photoResults.length > 0 && (
                <ResultList
                    heading={t('photo_results')}
                    searchResults={photoResults}
                    component={PhotoResult}
                    className="u-mt"
                />
            )}
            {observationsResults.length > 0 && (
                <p className="u-mt u-ml" style={{ fontSize: '1rem', lineHeight: '1.5rem' }}>
                    {`${observationsResults.length} ${t('observation_results')}`}
                </p>
            )}
        </div>
    );
}

InterviewSearchResults.propTypes = {
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    currentInterviewSearchResults: PropTypes.object.isRequired,
    segmentResults: PropTypes.array,
    headingResults: PropTypes.array,
    registryEntryResults: PropTypes.array,
    photoResults: PropTypes.array,
    biographyResults: PropTypes.array,
    annotationResults: PropTypes.array,
    observationsResults: PropTypes.array,
};
